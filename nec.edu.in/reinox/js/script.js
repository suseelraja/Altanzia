"use strict";
(function () {
  // Global variables
  var
    userAgent = navigator.userAgent.toLowerCase(),
    initialDate = new Date(),

    $document = $(document),
    $window = $(window),
    $html = $("html"),
    $body = $("body"),

    isDesktop = $html.hasClass("desktop"),
    isIE = userAgent.indexOf("msie") !== -1 ? parseInt(userAgent.split("msie")[1], 10) : userAgent.indexOf("trident") !== -1 ? 11 : userAgent.indexOf("edge") !== -1 ? 12 : false,
    isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    windowReady = false,

    plugins = {
      bootstrapTooltip:        $( '[data-toggle="tooltip"]' ),
      bootstrapModal:          $( '.modal' ),
      bootstrapTabs:           $( '.tabs-custom' ),
      captcha:                 $( '.recaptcha' ),
      campaignMonitor:         $( '.campaign-mailform' ),
      copyrightYear:           $( '.copyright-year' ),
      checkbox:                $( 'input[type="checkbox"]' ),
      lightGallery:            $( '[data-lightgallery="group"]' ),
      lightGalleryItem:        $( '[data-lightgallery="item"]' ),
      lightDynamicGalleryItem: $( '[data-lightgallery="dynamic"]' ),
      materialParallax:        $( '.parallax-container' ),
      mailchimp:               $( '.mailchimp-mailform' ),
      popover:                 $( '[data-toggle="popover"]' ),
      preloader:               $( '.preloader' ),
      rdNavbar:                $( '.rd-navbar' ),
      rdMailForm:              $( '.rd-mailform' ),
      rdInputLabel:            $( '.form-label' ),
      regula:                  $( '[data-constraints]' ),
      radio:                   $( 'input[type="radio"]' ),
      search:                  $( '.rd-search' ),
      searchResults:           $( '.rd-search-results' ),
      statefulButton:          $( '.btn-stateful' ),
      viewAnimate:             $( '.view-animate' ),
      wow:                     $( '.wow' ),
      maps:                    $( '.google-map-container' ),
      dataSplitting:           $('[data-splitting]'),
      selectFilter:            $("select"),
      slick:                   $('.slick-slider'),
      swiper:                  document.querySelectorAll( '.swiper-container' ),
      counter:                 document.querySelectorAll( '.counter' ),
      progressLinear:          document.querySelectorAll( '.progress-linear' ),
      progressCircle:          document.querySelectorAll( '.progress-circle' ),
      countdown:               document.querySelectorAll( '.countdown' ),
      waves:                   document.querySelectorAll('.waves')
    };


  // Initialize scripts that require a loaded window
  $window.on('load', function () {


    // Counter
    if ( plugins.counter ) {
      for ( var i = 0; i < plugins.counter.length; i++ ) {
        var
          node = plugins.counter[i],
          counter = aCounter({
            node: node,
            duration: node.getAttribute( 'data-duration' ) || 1000
          }),
          scrollHandler = (function() {
            if ( Util.inViewport( this ) && !this.classList.contains( 'animated-first' ) ) {
              this.counter.run();
              this.classList.add( 'animated-first' );
            }
          }).bind( node ),
          blurHandler = (function() {
            this.counter.params.to = parseInt( this.textContent, 10 );
            this.counter.run();
          }).bind( node );


          scrollHandler();
          window.addEventListener( 'scroll', scrollHandler );
      }
    }

    // Progress Bar
    if ( plugins.progressLinear ) {
      for ( var i = 0; i < plugins.progressLinear.length; i++ ) {
        var
          container = plugins.progressLinear[i],
          counter = aCounter({
            node: container.querySelector( '.progress-linear-counter' ),
            duration: container.getAttribute( 'data-duration' ) || 1000,
            onStart: function() {
              this.custom.bar.style.width = this.params.to + '%';
            }
          });

        counter.custom = {
          container: container,
          bar: container.querySelector( '.progress-linear-bar' ),
          onScroll: (function() {
            if ( ( Util.inViewport( this.custom.container ) && !this.custom.container.classList.contains( 'animated' ) ) ) {
              this.run();
              this.custom.container.classList.add( 'animated' );
            }
          }).bind( counter ),
          onBlur: (function() {
            this.params.to = parseInt( this.params.node.textContent, 10 );
            this.run();
          }).bind( counter )
        };

        counter.custom.onScroll();
        document.addEventListener( 'scroll', counter.custom.onScroll );
      }
    }

    // Progress Circle
    if ( plugins.progressCircle ) {
      for ( var i = 0; i < plugins.progressCircle.length; i++ ) {
        var
          container = plugins.progressCircle[i],
          counter = aCounter({
            node: container.querySelector( '.progress-circle-counter' ),
            duration: 500,
            onUpdate: function( value ) {
              this.custom.bar.render( value * 3.6 );
            }
          });

        counter.params.onComplete = counter.params.onUpdate;

        counter.custom = {
          container: container,
          bar: aProgressCircle({ node: container.querySelector( '.progress-circle-bar' ) }),
          onScroll: (function() {
            if ( Util.inViewport( this.custom.container ) && !this.custom.container.classList.contains( 'animated' ) ) {
              this.run();
              this.custom.container.classList.add( 'animated' );
            }
          }).bind( counter ),
          onBlur: (function() {
            this.params.to = parseInt( this.params.node.textContent, 10 );
            this.run();
          }).bind( counter )
        };

        counter.custom.onScroll();
        window.addEventListener( 'scroll', counter.custom.onScroll );
      }
    }

    // Spliting
    if ( plugins.dataSplitting.length && isDesktop ) {
      Splitting();
    }

    // Triangle
    function triangleCreate ( element ) {
      for ( var i = 0; i < element.length; i++ ) {
        var node = $( element[ i ] );
        var triangle = node.find( $( node.data('triangle' ) ) );

        var triangleWidth = node.innerWidth();
        var triangleHeight = node.innerHeight();

        triangle.css({
          'border-top-width'  : triangleHeight+'px',
          'border-left-width' : triangleWidth+'px'
        });
      }
    }
    var elementWithTriangleRight = $( '[data-triangle]' );
    if ( elementWithTriangleRight.length ) {
      triangleCreate( elementWithTriangleRight );
      $window.on( 'resize orientationchange' , function () {
        triangleCreate( elementWithTriangleRight );
      });
    }

    if ( plugins.waves.length ) {
      for ( var i = 0; i < plugins.waves.length; i++ ) {
        var wave = plugins.waves[i];
        var waves = new SineWaves({
          el: wave,
          speed: wave.getAttribute('data-speed') ||5,
          width: function() {
            return $(window).width();
          },

          height: function() {
            return $(window).height();
          },

          ease: wave.getAttribute('data-animation') || 'SineInOut',
          wavesWidth: wave.getAttribute('data-wave-width') || '150%',
          waves: [
            {
              timeModifier: 0.6,
              lineWidth: 5,
              amplitude: -200,
              wavelength: 200
            },
            {
              timeModifier: 0.13,
              lineWidth: 5,
              amplitude: -300,
              wavelength: 300
            }
          ],

          // Called on window resize
          resizeEvent: function() {
            var gradient1 = this.ctx.createLinearGradient(0, 0, this.width, 0);
            gradient1.addColorStop(0,"rgba(0, 172, 238, 1)");
            gradient1.addColorStop(0.54,"rgba(239, 165, 6, 1)");
            gradient1.addColorStop(1,"rgba(236, 57, 139, 1)");

            var gradient2 = this.ctx.createLinearGradient(0, 0, this.width, 0);
            gradient2.addColorStop(0,"rgba(32, 171, 208, 1)");
            gradient2.addColorStop(0.50,"rgba(83, 72, 182, 1)");
            gradient2.addColorStop(1,"rgba(234, 8, 140, 1)");

            var index = -1;
            var length = this.waves.length;
            while(++index < length){
              if ( index === 0 ) {
                this.waves[index].strokeStyle = gradient1;
              }
              else {
                this.waves[index].strokeStyle = gradient2;
              }
            }

            // Clean Up
            index = void 0;
            length = void 0;
            gradient1 = void 0;
            gradient2 = void 0;
          }
        });

        $window.scroll(function () {
          if ( !isScrolledIntoView( $(wave) ) ) {
            waves.running = false;
            waves.update();
          } else {
            waves.running = true;
            waves.update();
          }
        });
      }


    }
  });

  // Initialize scripts that require a finished document
  $(function () {

    /**
     * @desc Sets the actual previous index based on the position of the slide in the markup. Should be the most recent action.
     * @param {object} swiper - swiper instance
     */
    function setRealPrevious( swiper ) {
      var element = swiper.$wrapperEl[0].children[ swiper.activeIndex ];
      swiper.realPrevious = Array.prototype.indexOf.call( element.parentNode.children, element );
    }

    /**
     * @desc Sets slides background images from attribute 'data-slide-bg'
     * @param {object} swiper - swiper instance
     */
    function setBackgrounds( swiper ) {
      var swiperSlides = swiper.el.querySelectorAll( '[data-slide-bg]' );
      for (var i = 0; i < swiperSlides.length; i++) {
        var swiperSlide = swiperSlides[i];
        swiperSlide.style.backgroundImage = 'url('+ swiperSlide.getAttribute( 'data-slide-bg' ) +')';
      }
    }

    /**
     * @desc Animate captions on active slides
     * @param {object} swiper - swiper instance
     */
    function initCaptionAnimate( swiper ) {
      var
        animate = function ( caption ) {
          return function() {
            var duration;
            if ( duration = caption.getAttribute( 'data-caption-duration' ) ) caption.style.animationDuration = duration +'ms';
            caption.classList.remove( 'not-animated' );
            caption.classList.add( caption.getAttribute( 'data-caption-animate' ) );
            caption.classList.add( 'animated' );
          };
        },
        initializeAnimation = function ( captions ) {
          for ( var i = 0; i < captions.length; i++ ) {
            var caption = captions[i];
            caption.classList.remove( 'animated' );
            caption.classList.remove( caption.getAttribute( 'data-caption-animate' ) );
            caption.classList.add( 'not-animated' );
          }
        },
        finalizeAnimation = function ( captions ) {
          for ( var i = 0; i < captions.length; i++ ) {
            var caption = captions[i];
            if ( caption.getAttribute( 'data-caption-delay' ) ) {
              setTimeout( animate( caption ), Number( caption.getAttribute( 'data-caption-delay' ) ) );
            } else {
              animate( caption )();
            }
          }
        };

      // Caption parameters
      swiper.params.caption = {
        animationEvent: 'slideChangeTransitionEnd'
      };

      initializeAnimation( swiper.$wrapperEl[0].querySelectorAll( '[data-caption-animate]' ) );
      finalizeAnimation( swiper.$wrapperEl[0].children[ swiper.activeIndex ].querySelectorAll( '[data-caption-animate]' ) );

      if ( swiper.params.caption.animationEvent === 'slideChangeTransitionEnd' ) {
        swiper.on( swiper.params.caption.animationEvent, function() {
          initializeAnimation( swiper.$wrapperEl[0].children[ swiper.previousIndex ].querySelectorAll( '[data-caption-animate]' ) );
          finalizeAnimation( swiper.$wrapperEl[0].children[ swiper.activeIndex ].querySelectorAll( '[data-caption-animate]' ) );
        });
      } else {
        swiper.on( 'slideChangeTransitionEnd', function() {
          initializeAnimation( swiper.$wrapperEl[0].children[ swiper.previousIndex ].querySelectorAll( '[data-caption-animate]' ) );
        });

        swiper.on( swiper.params.caption.animationEvent, function() {
          finalizeAnimation( swiper.$wrapperEl[0].children[ swiper.activeIndex ].querySelectorAll( '[data-caption-animate]' ) );
        });
      }
    }


 
    // Countdown
    if ( plugins.countdown.length ) {
      for ( var i = 0; i < plugins.countdown.length; i++) {
        var
          node = plugins.countdown[i],
          countdown = aCountdown({
            node:  node,
            from:  node.getAttribute( 'data-from' ),
            to:    node.getAttribute( 'data-to' ),
            count: node.getAttribute( 'data-count' ),
            tick:  100,
          });
      }
    }
  });
}());
