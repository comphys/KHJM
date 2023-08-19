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

        SAVE['wdate']   = my.now_timestamp()
        SAVE['mdate']   = SAVE['wdate']
        SAVE['content'] = self.html_encode(SAVE['content'])
        SAVE.pop('mode')
        # ------------------------------------------------------------------
        if self.bid == 'estimate' :
            new_image_config = self.DB.one("SELECT save_img_dir2 FROM h_estimate_config WHERE no=1")
            if  new_image_config == '도면번호' and SAVE['add6'] and SAVE['add7'] :
                ext = my.file_split(SAVE['add6'])[2]
                old_name = SAVE['add7']
                new_name = f"{SAVE['add0']}.{ext}"
                if old_name != new_name :
                    old_full_name = SAVE['add6']
                    new_full_name = SAVE['add6'].replace(old_name,new_name) 

                    old_save_name = old_full_name.replace("/DOCU_ROOT",self.C['DOCU_ROOT'])
                    new_save_name = new_full_name.replace("/DOCU_ROOT",self.C['DOCU_ROOT'])
                    if  my.file_exist(old_save_name) : 
                        my.rename_file(old_save_name,new_save_name)
                        SAVE['add7'] = new_name
                        SAVE['add6'] = new_full_name
        # ------------------------------------------------------------------
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
        # ------------------------------------------------------------------
        if self.bid == 'estimate' :
            new_image_config = self.DB.one("SELECT save_img_dir2 FROM h_estimate_config WHERE no=1")
            if  new_image_config == '도면번호' and self.D['post']['add6'] and self.D['post']['add7'] :
                ext = my.file_split(self.D['post']['add6'])[2]
                old_name = self.D['post']['add7']
                new_name = f"{self.D['post']['add0']}.{ext}"
                if old_name != new_name :
                    old_full_name = self.D['post']['add6']
                    new_full_name = self.D['post']['add6'].replace(old_name,new_name) 

                    old_save_name = old_full_name.replace("/DOCU_ROOT",self.C['DOCU_ROOT'])
                    new_save_name = new_full_name.replace("/DOCU_ROOT",self.C['DOCU_ROOT'])
                    if  my.file_exist(old_save_name) : 
                        my.rename_file(old_save_name,new_save_name)
                        self.D['post']['add7'] = new_name
                        self.D['post']['add6'] = new_full_name
        # ------------------------------------------------------------------
        qry = self.DB.qry_update(tbl,self.D['post'],con)
        self.DB.exe(qry)

        if self.bid in ('daily_trading','daily_first','daily_second','daily_third','myLT') : 
            return self.moveto(f"board/list/{self.parm[0]}/page={self.page}/csh=on")
        if self.BCONFIG['stayfom'] == 'on' :
            return self.moveto(f"board/modify/{self.parm[0]}/no={no}/page={self.page}/brother={brother}")
        else :
            return self.moveto(f"board/body/{self.parm[0]}/no={no}/brother={brother}")

