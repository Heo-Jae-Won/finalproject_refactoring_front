
import React from 'react';
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "../Carousel.css";
import BestList from './BestList';
import 'animate.css'; 
/**
 * 약간의 animation이 담긴 homepage 화면
 */
const HomePage = () => {

  var animation = function () {
    var items, winH;
   
    var initModule = function () {
      items = document.querySelectorAll(".animate__animated");
      winH = window.innerHeight;
      _addEventHandlers();
    }
   
    var _addEventHandlers = function () {
      window.addEventListener("scroll", _checkPosition);
      window.addEventListener("load", _checkPosition);
      window.addEventListener("resize", initModule);
    };
   
    var _checkPosition = function () {
      for (var i = 0; i < items.length; i++) {
        var posFromTop = items[i].getBoundingClientRect().top;
        if (winH > posFromTop) {
          items[i].classList.add("animate__backInLeft");
        }
      }
    }
   
    return {
      init: initModule
    }
  }
   
  animation().init();

  return (
    <div className='sql'>

        <img
          sizes='100vw'
          className="d-block w-100"
          src="/image/image17.png"
          alt="빈 이미지"
        />

      <div className='img5'>
        <img
          size='10px'
          className="d-block w-100"
          src="/image/image16.jpg"
          alt="빈 이미지"
        />
      </div>

      <div className='animate__animated'>
        <img
          size='10px'
          className="d-block w-100"
          src="/image/image19.jpg"
          alt="빈 이미지"
        />
      </div>

      <h3>인기상품</h3>
      <hr />
      <BestList />
    </div>





  )
}

export default HomePage





