from system.core.load import Model
import system.core.my_utils as ut

class M_board_body(Model) :

    def body_main(self) :

        self.D['No'] = self.gets['no']

        qry = f"UPDATE h_{self.D['bid']}_board SET hit = hit +1 WHERE no = {self.D['No']}"
        self.DB.exe(qry)
        qry = f"SELECT * FROM h_{self.D['bid']}_board WHERE no = {self.D['No']}"
        BODY = self.DB.exe(qry,many=1,assoc=True)
        self.D['BODY'] = BODY

        self.D['BODY']['wdate']   = ut.timestamp_to_date(BODY['wdate'])
        self.D['BODY']['mdate']   = ut.timestamp_to_date(BODY['mdate'])
        self.D['BODY']['content'] = self.SYS.html_decode(BODY['content'])



