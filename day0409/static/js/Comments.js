/*
게시물 한 건을 표현하는 클래스 정의
주의) 이 파일은 게시물 자체가 아닌, 1건을 생성할 수 있는 틀이다!
*/
class Comments{
    constructor(container,msg,author,writeDay){
        this.container=container;
        this.wrapper; //이 객체가 부착될 부모 요소
        this.msgDiv;
        this.authorDiv;
        this.writeDayDiv;

        this.msg=msg;
        this.author=author;
        this.writeDay=writeDay;

        this.wrapper=document.createElement("div");
        this.msgDiv=document.createElement("div");
        this.authorDiv=document.createElement("div");
        this.writeDayDiv=document.createElement("div");

        //style
        this.msgDiv.style.width=70+"%";
        this.authorDiv.style.width=15+"%";
        this.writeDayDiv.style.width=10+"%";

        this.msgDiv.innerHTML=this.msg;
        this.authorDiv.innerHTML=this.author;
        this.writeDayDiv.innerHTML=this.writeDay;

        //wrapper에 동적으로 css class 적용
        this.wrapper.classList.add("comment-list");

        //div간 조립
        this.wrapper.appendChild(this.msgDiv);
        this.wrapper.appendChild(this.authorDiv);
        this.wrapper.appendChild(this.writeDayDiv);

        //container에 wrapper부착!
        this.container.appendChild(this.wrapper);
    }
}