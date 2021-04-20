/*java에서는 xml과 관련된 api가 자체적으로 지원되지만, node.js는 
xml을 해석하기 위해서는 역시나 외부 모듈을 사용해야 한다...

XML vs JSON ???

공통점 : 데이터 교환을 위한 형식, 포맷이다
            구조화되어 있기 때문에 데이터에 대한 표현이 체계적이다
            
차이점 : xml은 구조화를 태그로 표현
            json은 구조화를 객체 표기법으로 표현
            
자바와 같은 응용프로그램에서는 xml을 해석하는 작업은 까다롭다
하지만 , node.js에서는 xml을 자동으로 json으로 변환해주는 모듈이 지원된다
xml-js 모듈 설치해보자*/

var xmlConverter=require("xml-js");
var fs=require("fs");

//xml을 json으로 변환하기
fs.readFile("member.xml","utf8",function(err,data){
    var json=xmlConverter.xml2json(data,{compact:true, spaces:4});
    
    console.log(json);

})