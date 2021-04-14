/*
모듈은 변수, 함수 등의 코드를 모아놓고 파일로 저장한 단위(lib같은 것) 
개발자가 모듈을 정의할때는 내장객체 중 exports 객체를 사용하면 됨
*/

//getMsg 메서드를 현재 모듈 안에 정의한다!
exports.getMsg=function(){ //export는 모듈을 만들때 사용
    return "this message is from mymodule";
}

//랜덤값 가져오기
exports.getRandom=function(n){
    var r=parseInt(Math.random()*n);
    return n;
}

//한자리수 두자리 만들기(0추가)
exports.getZeroString=function(n){
    var result=(n>=10)? n:"0"+n;
    return result;
}

//메세지 처리 함수
exports.getMsgUrl=function(msg,url){
    var tag="<script>";
    tag+="alert('"+msg+"');";
    tag+="location.href='"+url+"';";
    tag+="</script>";
    return tag;
}