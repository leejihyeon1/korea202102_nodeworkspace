var http=require("http");
// 클라이언트가 업로드 한 바이너리 데이터 처리를 위한 모듈
var multer=require("multer"); //외부 모듈
// var oracledb=require("oracledb");//외부모듈
var mysql=require("mysql");//외부모듈
var express = require("express");
var mymodule=require("./lib/mymodule.js");
var fs=require("fs");
var path=require("path");//파일의 경로와 관련되어 유용한 기능을 보유한 모듈,확장자를 추출하는 기능 포함
var ejs=require("ejs");

var app = express();//express객체 생성 

//필요한 각종 미들웨어 적용 
app.use(express.static(__dirname+"/static"));

//업로드 모듈을 이용한 업로드 처리 storage-저장할곳, filename-저장할 이름
//노드 js 뿐만 아니라, asp
var upload = multer({
    storage: multer.diskStorage({
        destination:function(request, file, cb){
            cb(null, __dirname+"/static/upload");
        },
        filename:function(request, file, cb){
            console.log("file is ", file);
            //업로드한 파일에 따라서 파일 확장자는 틀려진다..프로그래밍적으로 정보를 추출해야 한다!!
            // path.extname(file.originalname)의 결과는 jpg,png..
            console.log("업로드된 파일의 확장자는", path.extname(file.originalname));
            cb(null, new Date().valueOf()+path.extname(file.originalname));
        }
    })    
});
//오라클 접속 정보
var conStr={
    user:"root",
    password:"1234",
    host:"localhost",
    port:"3307",
    database:"nodejs"
}
//글목록 요청 처리
app.get("/gallery/list",function(request,response){
    var con=mysql.createConnection(conStr);
    var sql="select * from gallery order by gallery_id desc"; //내림차순
    con.query(sql,function(err,result,fields){
        if(err){
            console.log(err);
        }else{
            fs.readFile("./gallery/list.ejs","utf8",function(err,data){
                if(err){
                    console.log(err)
                }else{
                    response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
                    response.end(ejs.render(data,{
                        galleryList:result,
                        lib:mymodule
                    }));
                }
            });
        }
        con.end();
    })
    
});
//등록요청 처리
app.post("/gallery/regist",upload.single("pic"),function(request,response){
    //파라미터 받기
    var title=request.body.title;//express모듈을 사용하기 때문에 사용가능
    var writer=request.body.writer;
    var content=request.body.content;
    var filename=request.file.filename;//multer를 이용했기 때문에 기존의 request객체에 추가된 것임!
    //mysql에 접속
    var con=mysql.createConnection(conStr);
    var sql="insert into gallery(title,writer,content,filename) values(?,?,?,?)";
    con.query(sql,[title,writer,content,filename],function(err,fields){
        if(err){
            console.log(err);
        }else{
            response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
            response.end(mymodule.getMsgUrl("등록완료","/gallery/list"));
        }
        con.end();
    })
});
//상세보기 요청
app.get("/gallery/detail",function(request,response){
    var con=mysql.createConnection(conStr);
    var gallery_id=request.query.gallery_id;//get방식의 파라미터 추출
    var sql="select * from gallery where gallery_id="+gallery_id;
    con.query(sql,function(err,result,fields){
        if(err){
            console.log(err);
        }else{
            //상세페이지 보여주기
            fs.readFile("./gallery/detail.ejs","utf8",function(error,data){
                if(error){
                    consokle.log(error);
                }else{
                    var d=ejs.render(data,{
                        gallery:result[0] //result가 한건의 데이터만 담고 있다고 하더라도 배열이기 때문에 [0]
                    })
                    response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
                    response.end(d);
                }
            })
        }
        con.end();
    })
});

//수정 요청 처리(서버가 업로드 컴포넌트를 사용하게되면, post는 무조건 업로드컴포넌트 이용해야함)
app.post("/gallery/edit",upload.single("pic"),function(request,response){
    var title=request.body.title;//express모듈을 사용하기 때문에 사용가능
    var writer=request.body.writer;
    var content=request.body.content;
    var filename=request.body.filename;//기존의 파일명(내가 보고있는 파일), multer를 이용했기 때문에 기존의 request객체에 추가된 것임!
    var gallery_id=request.body.gallery_id;//get-query, post-body

    if(request.file !=undefined){//업로드를 원하는것임(사진 교체)
        console.log("사진 교체");

        fs.unlink(__dirname+"/static/upload/"+filename,function(err){
            if(err){
                console.log("삭제실패",err);
            }else{
                filename=request.file.filename;//새롭게 업로드된 파일명으로 교체(새로운 파일)
                var con=mysql.createConnection(conStr);
                var sql="update gallery set title=?, writer=?, content=?, filename=? where gallery_id=?";//사진도 변경
                con.query(sql,[title,writer,content,filename,gallery_id],function(err,fields){
                    if(err){
                        console.log("수정실패",err);
                    }else{
                        response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
                        response.end(mymodule.getMsgUrl("수정 완료","/gallery/detail?gallery_id="+gallery_id));
                    }
                    con.end();
                })
            }
        });
    }else{//사진 유지
        console.log("사진 유지");

        var con=mysql.createConnection(conStr);
        var sql="update gallery set title=?, writer=?, content=? where gallery_id=?";//사진 유지
        con.query(sql,[title,writer,content,gallery_id],function(err,fields){
            if(err){
                console.log("수정실패",err);
            }else{
        response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
        response.end(mymodule.getMsgUrl("수정 완료","/gallery/detail?gallery_id="+gallery_id));
    }
    con.end();
    });
    }
});

//삭제 요청 처리(DB삭제+이미지 삭제)
// 파일을 업로드 하건, 안하건 일단 multer를 사용하게 되면 모든 post방식에 관여하게 되어 있다-
app.post("/gallery/del",upload.single("pic"),function(request,response){
    var gallery_id=request.body.gallery_id;//get-query, post-body
    var filename=request.body.filename;
    //파일삭제(파일경로,파일삭제)
    fs.unlink(__dirname+"/static/upload/"+filename,function(err){
        if(err){
            console.log(err);
        }else{
            var con=mysql.createConnection(conStr);
            var sql="delete from gallery where gallery_id="+gallery_id;
            con.query(sql,function(error,fields){
                if(err){
                    console.log(error);
                }else{
                    response.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
                    response.end(mymodule.getMsgUrl("삭제 완료","/gallery/list"));
                }
                con.end();
            })
        }
    });
});

var server = http.createServer(app); //기본 모듈에 express 모듈 연결 
server.listen(9999, function(){
    console.log("Gallery Server is running at 9999 port...");
});