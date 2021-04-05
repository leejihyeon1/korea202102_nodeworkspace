/*
내장 모듈 중 file system 모듈을 사용해보자!!
파일처리와 관련된 기능을 갖는 모듈이다..*******개중요!****
*/

 var fs=require("fs");//모듈 가져오기

 //원하는 파일의 내용을 읽어서, 현재 프로그램으로 가져와보자!
 var text=fs.readFileSync("./노트정리.html","utf8");//읽어들인 결과를 메모리에 올려서 text변수에 담아 놓기!


 console.log(text);

 //파일 시스템 객체를 이용하여 읽어들인 내용은 비어있는 파일에 출력해보자!
 //(어디에,어떤내용,인코딩방식,완료된시점에 하고싶은것)
 fs.writeFile("./empty.txt",text,"utf8",function(){
     console.log("파일에 쓰기를 완료했습니다!");
 });
