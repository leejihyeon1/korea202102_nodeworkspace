/*
Node.js의 기본 모듈만으로는 서버를 구축할 수는 있으나, 개발자가 처리해야할 업무가 너무 많고
효율성이 떨어진다.. 따라서 기본 모듈 외에, http모듈을 좀 더 개선한 express모듈을 사용해보자!
주의) http 기본 모듈이 사용되지 않는 것이 아니라, 이 기본 모듈에 express모듈을 추가해서 사용한다

[express 모듈의 특징]
1) 정적 자원에 대한 처리가 이미 지원된다.. 즉 개발자가 각 자원마다 1:1대응하는 코드를 작성할 필요가 없다
2)Get/Post 등의 http요청에 대한 파라미터 처리가 쉽다
3)미들웨어라 불리는 use() 메서드를 통해 기능을 확장한다!
*/

var http=require("http"); //express가 http안에서 살아서 express는 http와 세트
var express = require("express");
var app=express(); //express 모듈 통해 객체 생성
var static=require("serve-static");//정적자원을 쉽게 접근하기 위한 미들웨어 추가
var fs=require("fs");
var ejs=require("ejs");
var mysql=require("mysql");
var mymodule=require("./lib/mymodule.js");


//mysql접속정보
var conStr={
  host:"localhost",
  user:"root",
  password:"1234",
  database:"nodejs",
  port:"3307"
};
//서버의 정적자원에 접근을 위해 static() 미들 웨어를 사용해본다! <-->dynamic(동적)
//__dirname? 현재 실행중인 js파일의 디렉토리 위치를 반환(directory name)
// console.log("이미지 정적 자원이 들어있는 풀 경로는",__dirname+"/images");
app.use(static(__dirname+"/static"));//app.use(static(쉽게 접근하고픈 정적 자원의 경로--프로그래밍 적으로 경로지정!!!!));
app.use(express.urlencoded({extended:true}));//post방식의 데이터를 처리할 수 있도록

//클라이언트의 요청처리!!-------> 요청 url에 대한 조건문X, 정적 자원에 대한 처리필요X
// DML업무를 CRUD로 얘기하기도 함
// CRUD : Create(=insert), Read(=select), Update, Delete
app.get("/notice/list",function(request,response){
    var con=mysql.createConnection(conStr);
    //select문 수행하자!
    con.query("select * from notice order by notice_id desc",function(error, result, fields){
        if(error){
            console.log(error);
        }else{
            fs.readFile("./notice/list.ejs","utf8",function(err,data){
                if(err){
                    console.log(err);
                }else{
                    response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
                    //읽기만 하는게 아니라, 서버에서 실행까지 해야 하므로, render()메서드를 이용하여
                    // %%영역을 클라이언트에게 보내기 전에, 서버측에서 먼저 실행을 해버리자!
        
                    response.end(ejs.render(data,{
                        noticeList:result,//result에는 db데이터가 json으로 있음
                        lib:mymodule
                    }));      
                }
            });
        }
        con.end();
    });
});
//지정한 url의 post방식으로 클라이언트의 요청을 받음
app.post("/notice/regist",function(request,response){
    // 1) 클라이언트가 전송한 파라미터들을 받자!
    console.log(request.body);//post방식-body, get방식-head
    var title=request.body.title;
    var writer=request.body.writer;
    var content=request.body.content;

    // 2) mysql 접속
    var con=mysql.createConnection(conStr);

    // 3) 쿼리 실행
    // var mysql="insert into notice(title,writer,content) values('"+title+"','"+writer+"','"+content+"');"
    /*
    바인드 변수를 이용하면, 따옴표 문제를 고민하지 않아도 됨!
    단, 바인드 변수의 사용목저근 따옴표 때문이 아니라 , DB의 성능과 관련이 있다 
    */
    var sql="insert into notice(title,writer,content) values(?,?,?);"

    con.query(sql,[title,writer,content],function(err,fields){
        if(err){
            console.log(err)
        }else{
            response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
            response.end("<script>alert('등록성공');location.href='/notice/list';</script>");
        }
        con.end();
    });
});

//목록 요청 처리
app.get("/notice/detail",function(request,response){
    var notice_id=request.query.notice_id;
    var sql="select * from notice where notice_id=?";

    var con=mysql.createConnection(conStr);
    con.query(sql,[notice_id],function(err,result,fields){
        if(err){
            console.log(err);
        }else{
            //디자인 보여주기 전에, 조회수 증가
            con.query("update notice set hit=hit+1 where notice_id=?",[notice_id],function(error1,fields){
                if(error1){
                    console.log(error1);
                }else{
                    fs.readFile("./notice/detail.ejs","utf8",function(error,data){
                        if(error){
                            console.log(error);
                        }else{
                            response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
                            response.end(ejs.render(data,{
                                // result는 한건이라 할지라도 배열이므로, 배열에서 꺼내서 보여주자
                                record:result[0]
                            }))
                        }
                    });
                }
                con.end();
            });
        }
    });
});

//글 수정 요청 처리
app.post("/notice/edit",function(request,response){
    //파라미터 받기
    var title=request.body.title;
    var writer=request.body.writer;
    var content=request.body.content;
    var notice_id=request.body.notice_id;
    console.log("제목",title,"작성자",writer,"내용",content,"id",notice_id);

    //파라미터가 총 4개 필요하다!
    var sql="update notice set title=?, writer=?, content=? where notice_id=?";

    var con=mysql.createConnection(conStr);
    con.query(sql,[title,writer,content,notice_id],function(err,fields){
        if(err){
            console.log(err);
        }else{
            response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
            response.end(mymodule.getMsgUrl("수정완료","/notice/detail?notice_id="+notice_id));
        }
        con.end();
    });
});

//삭제 요청 처리
app.post("/notice/del",function(request,response){
    var notice_id=request.body.notice_id;
    var sql="delete from notice where notice_id=?";
    var con=mysql.createConnection(conStr);
    con.query(sql,[notice_id],function(err,fields){
        if(err){
            console.log(err);
        }else{
            response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
            response.end(mymodule.getMsgUrl("삭제완료","/notice/list"));
        }
    });
});

var server=http.createServer(app);//http서버에 express 모듈을 적용
server.listen(8989,function(){
    console.log("The server using Express module is running at 8989...")
});