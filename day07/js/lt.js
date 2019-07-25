function lt(a) {
    if (typeof a === 'string') {
        return lt.prototype.init(a);
    }
}
lt.prototype = {
    constructor: lt,
    init(a) {
    	this.selector = a;
        this.el = document.querySelector(a);
        return new lt();
    },
    option: {
    	animate: 1, // 轮播的方式
		css:{}, // css配置项
		html:{ // html配置项
			items:[]
		},
		roundlist: {}, // 列表圆点配置项
		btn: {}, // 左右按钮配置项
		autoplay: true, // 是否需要自动播放
		time: 3000, // 单张图片切换事件 单位毫秒
		transition: 1000 // 单张图片开始运动到街上运动的时间 单位毫秒
    },
    merge(oldOption, newOption) {
        for(var item in newOption) {
            if(typeof newOption[item] === 'object') {
                if(!oldOption[item] && oldOption.constructor == Array) {
                    oldOption[item] = {};
                }
                this.merge(oldOption[item], newOption[item]);
            } else {
                oldOption[item] = newOption[item]
            }
        }
    },
    renderCss() {
    	var {selector} = this;
        var str = `
        	${selector} .img-box {
		        height: 100%;
		        position: relative;
		    }
		    ${selector} .img-box li {
		        height: 100%;
		        width: 100%;
		        position: absolute;
		        transition: all 1s;
                overflow:hidden;

		        opacity: 0;
		    }
		    ${selector} .img-box li img{
	        	position: absolute;
	        	left: 50%;
	        	transform: translateX(-50%);
	        }
		    ${selector} .img-box li:first-child {
		        z-index: 1;
		        opacity: 1;
		    }
		    ${selector} .img-box a {
		        display: block;
		        font-size: 100px;
		        line-height: 600px;
		        text-align: center;
		    }
		    ${selector} .list-box {
		        position: absolute;
		        bottom: 0;
		        z-index: 2;
		        left: 50%;
		        transform: translate(-50%, -50%);
		    }
		    ${selector} .list-box li {
		        width: 20px;
		        height: 20px;
		        background-color: #000;
		        border-radius: 50%;
		        float: left;
		        margin-right: 10px;
		    }

		    ${selector} .list-box li:last-child {
		        margin-right: 0;
		    }
		    ${selector} .box-btn button {
		        position: absolute;
		        top: 50%;
		        transform: translateY(-50%);
		        z-index: 2;
		    }
		    ${selector} .box-btn-left {
		        left: 0;
		    }
		    ${selector} .box-btn-right {
		        right: 0;
		    }
		    ${selector} .list-box li.active {
		        background-color: #fff;
		    }`;
        var style = document.createElement('style');
        style.innerHTML = str;
        document.head.appendChild(style);
    },
    renderDom() {
    	var {option} = this;
    	var li = option.html.items.map(function(item){
    		return `<li style="background-color: red"><a href="${item.url}"><img src="${item.img}" alt="" /></a></li>`
    	}).join('');
    	var round = option.html.items.map(function(item, index){
    		return index == 0 ? `<li class="active"></li>` :  `<li></li>`;
    	}).join('');
        var str = `
	    	<ul class="img-box">${li}</ul>
	        <ul class="list-box">${round} </ul>
	        <div class="box-btn">
	            <button class="box-btn-left">左边按钮</button>
	            <button class="box-btn-right">右边按钮</button>
	        </div>`;
        this.el.innerHTML = str;
    },
    /*
    		
    */
    animateLbt(index){
    	var {imgList, roundList} = this;
        for (let i = 0; i < imgList.length; i++) {
            imgList[i].style.opacity = 0;
            imgList[i].style.zIndex = 0;
            roundList[i].className = '';
        }
        roundList[index].className = 'active';
        imgList[index].style.opacity = 1;
        imgList[index].style.zIndex = 1;
    },
    qie(x) {
        if (x == 'next') {
            this.currentIndex++;
            if (this.currentIndex > 3) this.currentIndex = 0;
        }
        if (x == 'prev') {
            this.currentIndex--;
            if (this.currentIndex < 0) this.currentIndex = 3;
        }
        this.animateLbt(this.currentIndex);
    },
    autoplay(){
    	var {el} = this;
    	var timer = setInterval(() => this.qie('next'), 3000);
        el.onmouseenter = () => clearInterval(timer);
        el.onmouseleave = () => timer = setInterval(() => this.qie('next'), 3000);
    },
    lbt(o) {
        var {el, renderDom, option} = this;
        this.merge(option, o);
        this.renderCss();
        renderDom.call(this);
        this.imgList = el.querySelectorAll('.img-box li');
        this.roundList = el.querySelectorAll('.list-box li');
        var prev = el.querySelector('.box-btn-left');
        var next = el.querySelector('.box-btn-right');
        this.currentIndex = 0;
        
        for (let i = 0; i < this.roundList.length; i++) {
            this.roundList[i].onclick = ()=> {
                this.currentIndex = i;
                this.animateLbt(this.currentIndex);
            }
        }
        prev.onclick = () => this.qie('prev');
        next.onclick = () => this.qie('next');
        if(option.autoplay) this.autoplay();
    }
}