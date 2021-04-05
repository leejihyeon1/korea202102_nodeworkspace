var http= require("http");  //내장모듈이기 때문에 별도의 설치 불필요
var fs=require("fs");   //파일을 제어하는 내장모듈

var server=http.createServer(function(request,response){//request,response 임의로 이름 저장 가능 , but 순서는 맞게 써야함!
    // request:클라이언트의 요청 정보
    // response: 클라이언트의 요청에 대한 응답

    fs.readFile("./regist_form.html","utf-8",function(err,data){

        //http의 형식을 갖추어서 클라이언트에게 응답을 해보자
        response.writeHead(200,{"Content-Type":"text/html; charset=utf-8"});//header 정보를 제대로 갖추어서 응답하자!
        response.end(data); //클라이언트에 지정한 문자열 전송!
    });

    
});



server.listen(7878,function(){
    console.log("my server is running at 7878...");
});//서버 가동