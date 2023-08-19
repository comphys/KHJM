from system.core.load import Control
import system.core.my_utils as my

class Action(Control) : 

    def _auto(self) :
        self.DB = self.db('jbk')
        self.bid   = self.parm[0]
        self.board = 'h_'+self.bid+'_board'
        self.page  = self.gets.get('page','1') 
        self.DB.tbl, self.DB.wre = ("h_board_config",f"bid='{self.bid}'")
        self.BCONFIG = self.DB.get("*",many=1,assoc=True)
  
    def save(self) :
        # h_{bid}_board : [no,brother,add0,uid,uname,content,reply,hit,wdate,mdate,add1~add15]
        
        # 저장 시 [정수 및 실수] 형식은 형태를 수정하여 저장한다. 
        USE_KEY = []
        for i in range(16) :
            key = f'add{i}' 
            if self.BCONFIG[key] :  USE_KEY.append(key)        

        SAVE = self.D['post']

        if SAVE['mode'] == 'add_body' :
            no = int(self.gets.get('no',0))
            origin = int(SAVE['brother']) if int(SAVE['brother']) > 0 else no
            qry = f"UPDATE {self.board} SET brother = brother-1 WHERE no={origin}"
            self.DB.exe(qry)
            SAVE['brother'] = no if int(SAVE['brother']) <= 0 else int(SAVE['brother'])

 
        SAVE['wdate']   = my.now_timestamp()
        SAVE['mdate']   = SAVE['wdate']
        SAVE['content'] = self.html_encode(SAVE['content'])
        self.info( SAVE['content'])
        SAVE.pop('mode')
       
        qry = self.DB.qry_insert(self.board,SAVE)
        self.DB.exe(qry)

        return self.moveto('board/list/'+self.bid+'/page='+self.page+'/csh=on')

    def delete(self) :
        no      = self.gets['no']
        bid     = self.parm[0]
        page    = self.gets['page']
        
        board_type = self.DB.one(f"SELECT type FROM h_board_config WHERE bid='{bid}'")
        
        if board_type == 'yhboard' :
            qry =   f"SELECT brother FROM h_{bid}_board WHERE no={no}"
            brother = self.DB.one(qry)

            if brother < 0 : self.echo("추가글이 존재합니다")
            if brother > 0 : self.DB.exe(f"UPDATE h_{bid}_board SET brother = brother + 1 WHERE no={brother}")

            qry = f"DELETE FROM h_{bid}_reply WHERE parent={no}"
            self.DB.exe(qry)
        
        # 견적관리 전용
        if  bid=='estimate' :
            img_name = self.DB.one(f"SELECT add6 FROM h_estimate_board WHERE no={no}")
            if  img_name :
                img_name = img_name.replace("/DOCU_ROOT",self.C['DOCU_ROOT'])
                if my.file_exist(img_name) : my.delete_file(img_name)
        
        qry = f"DELETE FROM h_{bid}_board WHERE no={no}"
        self.DB.exe(qry)
        

        
        return self.moveto(f"board/list/{bid}/page={page}")

    def modify(self) :
        # h_{bid}_board : [no,brother,add0,uid,uname,content,reply,hit,wdate,mdate,add1~add15]
        brother = self.D['post'].get('brother',0)
        tbl     = 'h_'+self.parm[0]+'_board'
        no      = self.gets['no']

        con     = f"no={no}"
        # 업데이트 항목 외에는 pop 시킨다.
        self.D['post'].pop('mode')
        # 
        self.D['post']['mdate'] = my.now_timestamp()
        self.D['post']['content'] = self.html_encode(self.D['post']['content'])
        self.info( self.D['post']['content'])

        qry = self.DB.qry_update(tbl,self.D['post'],con)
        self.DB.exe(qry)

        if self.bid in ('daily_trading','daily_first','daily_second','daily_third','myLT') : 
            return self.moveto(f"board/list/{self.parm[0]}/page={self.page}/csh=on")
        if self.BCONFIG['stayfom'] == 'on' :
            return self.moveto(f"board/modify/{self.parm[0]}/no={no}/page={self.page}/brother={brother}")
        else :
            return self.moveto(f"board/body/{self.parm[0]}/no={no}/brother={brother}")
