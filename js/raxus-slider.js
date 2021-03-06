///////////////////////////////
// Author: Bora DAN
// Version: 2.0.4
// 13 March 2015
// http://dribbble.com/bqra
// http://themeforest.com/bqra
// http://twitter.com/bqra
// http://pikselmatik.com
///////////////////////////////

var rS = '.raxus-slider';

var number = 0;
function move(that, pixel) {
    that.css({
        '-webkit-transform': 'translate3d(' + pixel + ', 0)',
        '-moz-transform': 'translate3d(' + pixel + ', 0)',
        '-o-transform': 'translate3d(' + pixel + ', 0)',
        '-ms-transform': 'translate3d(' + pixel + ', 0)',
        'transform': 'translate(' + pixel + ')'
    });
}

// slider actions
function raxusSliderGlobal(that,direction){  
    var e = jQuery(that).parents('.raxus-slider'), rel = e.find('.slider-relative'), action;
    var dataShow = parseInt(e.attr('data-show'));
    var slide = ( e.attr('data-direction') == 'vertical' ) ? e.find('.slide').eq(dataShow).outerHeight(true) : e.find('.slide').eq(dataShow).outerWidth(true);
    var totalSize = e.find('.slide').size()-1;
    var totalW = totalSize*slide;
    var pixel = slide * dataShow;
    var pixelH = slide * dataShow;
    var loop = e.attr('data-loop') == 'false';

    e.removeAttr('data-playing');
    e.find('iframe').remove();
    e.find('.play-button, img, .slide .text, .fullscreen').show(0);
    jQuery(that).parents('.raxus-slider[data-dots]').find('ul.dots').show(0);

    if ( totalW == pixel && direction == '-' ) {
        if ( loop ) { return false; } else {
            dataShow = 0;
            e.attr('data-show', '0');
        }
    } else if ( dataShow == 0 && direction == '+' ) {
        if ( loop ) { return false; } else {
            dataShow = totalSize;
            e.attr('data-show', totalSize);
        }
    } else if ( direction == 'dot' ) {
        dataShow = jQuery(that).index();
        e.attr('data-show', jQuery(that).index());
    } else {
        dataShow = (direction == '-') ? dataShow+1 : dataShow-1;
        e.attr('data-show', dataShow);
    }
    pixel = slide * dataShow;
    action = ( e.attr('data-direction') == 'vertical' ) ? '0, -' + pixel + 'px' : '-' + pixel + 'px, 0';
    move(rel,action);
    if ( dataShow == totalSize ) { 
        jQuery(that).parents('.raxus-slider[data-loop]').find('.arrow-r').css('opacity', '0.5');
    } else if (dataShow == 0 ) {
        jQuery(that).parents('.raxus-slider[data-loop]').find('.arrow-l').css('opacity', '0.5');
    } else {
        jQuery(that).parents('.raxus-slider[data-loop]').find('.arrow-r, .arrow-l').css('opacity', '1');
    }

    if ( e.find('.mini-images').length ) {
        var miniImgs = e.find('.mini-images'),
        miniImgsLi = e.find('.mini-images li');

        //mini images selecting
        miniImgsLi.removeClass('selected');
        miniImgsLi.eq(e.attr('data-show')).addClass('selected');

        // mini images direction auto actions
        var thumbPixel,
        ifDir = ( e.attr('data-thumbnail') == 'left' || e.attr('data-thumbnail') == 'right' ),
        miniSlide = ifDir ? miniImgsLi.outerHeight(true) : miniImgsLi.outerWidth(true), 
        miniSize = miniImgsLi.size()-1, 
        miniDirSize = ifDir ? e.height() : e.width(),
        miniShow = miniDirSize / miniSlide,
        miniSelected = e.find('.mini-images li.selected').index(),
        margin = ifDir ? 30 : 20,
        firstDisplay = parseInt(miniImgsLi.eq(0+number).index());

        miniShow = parseInt(miniShow-1);
        if ( miniSize-1 >= miniShow ) {
            if ( miniSelected == miniImgsLi.slice(-1).index() || miniSelected == miniImgsLi.slice(-2).index() ) {
                thumbPixel = -( (miniSize - miniShow) * miniSlide) + margin, number = miniImgsLi.last().index() - miniShow;
            } else if ( miniSelected == miniSize && miniShow <= miniSize ) {
                thumbPixel = -miniSelected * miniSlide + miniSlide * miniShow, number = miniSelected - miniShow+1;
            } else if ( miniSelected == 0 ) {
                thumbPixel = 0, number = miniSelected;
            } else if ( miniSelected >= firstDisplay + miniShow ) {
                thumbPixel = -miniSelected * miniSlide + miniSlide * (miniShow-1), number = miniSelected - miniShow+1;
            } else if ( miniSelected <= firstDisplay ) {
                thumbPixel =  -(miniSelected-1) * miniSlide, number = miniSelected-1;
            } else {
                thumbPixel = miniImgs.attr('data-thumbwidth');
            }
            miniImgs.attr('data-thumbwidth', thumbPixel);
            thumbPixel = ifDir ? '0, ' + thumbPixel + 'px' : thumbPixel + 'px, 0';
            move(miniImgs, thumbPixel);
        }
    }

    dataEqSel();

    // dots selecting
    e.find('.dots li').removeClass('selected');
    e.find('.dots li').eq(e.attr('data-show')).addClass('selected');

    // close video
    e.find('.close-video').click();

    // text animation
    rel.find('.slide .text').removeClass('left-animated');
    rel.find('.slide:eq('+dataShow+') .text').addClass('left-animated');
}

// functions
function thumbNoSlide() {
    jQuery(rS+'[data-thumbnail]').each(function() {
        if ( jQuery(this).find('.mini-images li').size() * jQuery(this).find('.mini-images li').outerWidth(true) < jQuery(this).outerWidth() ) {
            jQuery(this).find('.mini-images').addClass('no-slide');
        }
    });
}
function rePositioning() {
    jQuery('.raxus-slider[data-thumbnail]').each(function() {
        var thumb = jQuery(this).attr('data-thumbnail');
        var way = thumb == 'left' || thumb == 'right' ? jQuery(this).find('.mini-images-relative').outerWidth() : jQuery(this).find('.mini-images-relative').outerHeight();
        jQuery(this).find('.slider-area').animate({'left':0, 'right':0, 'top': 0, 'bottom':0},0);
        jQuery(this).find('.slider-area').css(thumb, way);
    });

    thumbNoSlide();

    jQuery('.raxus-slider').map(function(index, el) {
        raxusSliderGlobal('.dots:eq('+index+') li.selected', 'dot');    
        return this;
    });
}
function videoId(data) {
    data.match(/http:\/\/(player.|www.)?(vimeo\.com|youtu(be\.com|\.be))\/(video\/|embed\/|watch\?v=)?([A-Za-z0-9._%-]*)(\&\S+)?/);
    return {
        url: RegExp.$2,
        id: RegExp.$5,
        site: RegExp.$2 == 'youtube.com' || RegExp.$2 == 'youtu.be' ? 'http://www.youtube-nocookie.com/embed/' : 'http://player.vimeo.com/video/'
    }
}

//slides selecting
function dataEqSel() {
    jQuery(rS).each(function(){
        var t = jQuery(this);
        t.find('.slide').removeClass('selected');
        var dataEq = t.attr('data-show') == 0 ? null : (t.attr('data-show') - 1);
        t.find('.slide:eq(' + dataEq + '), .slide:eq(' + t.attr('data-show') + '), .slide:eq(' + (parseInt(t.attr('data-show')) + 1) + ')').addClass('selected');
    });
}

jQuery(function(){

    /////////////////////////////
    // appends
    /////////////////////////////
    jQuery(rS).attr('data-show', '0');

    // wrap slider area
    jQuery(rS+' .slider-relative').wrap('<div class="slider-area"></div>');
    jQuery(rS+' .slider-relative .slide img').wrap('<span class="image"></span>');

    // first text animation
    jQuery(document).ready(function() {
        jQuery(rS+' .slider-relative').find('.slide:eq(0) .text').addClass('left-animated');
    });

    jQuery(rS+' .slider-relative').find('.slide:eq(0)').addClass('selected');

    // dots append
    jQuery(rS+' .slider-area').append('<ul class="dots"></ul>');
    jQuery(rS+' .slider-area').each(function() {
        for (var i = jQuery(this).find('.slide').size() - 1; i >= 0; i--) {
            jQuery(this).find('.dots').append('<li><span></span></li>')
        }; 
        jQuery(this).find('.dots').css('margin-top', -(jQuery(this).find('.dots').height()/2));
    });
    jQuery(rS+' .slider-area').find('.dots li:eq(0)').addClass('selected');

    // arrows append
    jQuery(rS+' .slider-area').append('<div class="arrow-l"></div><div class="arrow-r"></div>');
    jQuery(rS+'[data-arrows=outer]').find('.arrow-l, .arrow-r').addClass('outer');

    // mini images append
    jQuery(rS+'[data-thumbnail]').append('<div class="mini-images-relative"><ul data-thumbwidth="0" class="mini-images"></ul></div>');
    jQuery(rS+'[data-thumbnail]').each(function() {
        var thumb = jQuery(this).attr('data-thumbnail');
        for (var i = 0; i <= jQuery(this).find('.slide').size()-1; i++) {
            var thumbUrl = jQuery(this).find(".slider-relative li").eq(i).find(".image img");
            thumbUrl = thumbUrl.attr('data-thumbnailurl') == null ? thumbUrl.attr("src") : thumbUrl.attr("data-thumbnailurl");
            jQuery(this).find('.mini-images').append('<li><span class="img-selected"></span><div class="image"><img src="' + thumbUrl + '" alt="" /></div></li>')
        };
        var miniCalc = ( thumb == 'bottom' || thumb == 'top' ) ? jQuery(this).find('.mini-images-relative').outerHeight() : jQuery(this).find('.mini-images-relative').outerWidth();
        jQuery(this).find('.slider-area').css(thumb, miniCalc+'px');
    });
    thumbNoSlide();
    jQuery(rS+'[data-thumbnail]').find('.mini-images li:eq(0)').addClass('selected');

    // fullscreen icon append
    jQuery(rS+'[data-fullscreen=show]').append('<span class="fullscreen"></span>');

    // tabindex append
    jQuery(rS).each(function(index){
        jQuery(this).attr('tabindex', index);
    });

    // slides selecting
    dataEqSel();

    // auto-play
    var autoPlaySelector = jQuery('.raxus-slider[data-autoplay]');
    autoPlaySelector.each(function() {
        jQuery(this).find('.arrow-r').addClass('autoPlayButton');
        autoPlay(jQuery(this).attr('data-autoplay'), jQuery(this));
    });
    function autoPlay(time, that) {
        var playIt = setInterval(function(){
            raxusSliderGlobal(that.find('.arrow-r.autoPlayButton'), '-');
        }, time);
        function stopPlay() {
            clearInterval(playIt);
            that.find('.arrow-r').removeClass('autoPlayButton');
        }
        function startPlay(){
            if (!( that.find('.close-video').length ))
                that.find('.arrow-r').addClass('autoPlayButton');
            playIt = setInterval(function(){
                raxusSliderGlobal(that.find('.arrow-r'), '-');
            }, time);
        }
        that.on('touchstart', function(){
            stopPlay();
        });
        that.on('touchstart', function(){
            startPlay();
        });
        that.hover(function() {
            stopPlay();
        }, function() {
            if ( that.attr('data-playing') != 'true' ) {
                startPlay();
            }
        });
        jQuery(document).on('click touchstart', rS + ' .play-button', function(){
            that.attr('data-playing', 'true');
            stopPlay();
        });
    }

    // video appends and settings 
    jQuery('[data-videoUrl]').after('<div class="play-button"></div>');
    jQuery(document).on('click touchstart touch', rS + ' .play-button', function(){
        var t = jQuery(this);
        t.hide(0);
        t.prev('img').hide(0);
        t.parents('.slide').find('.text').hide(0);
        t.parents('.slide').append('<div class="close-video"></div>');
        t.parents('.raxus-slider').find('.fullscreen, ul.dots').hide(0);
        t.parent().append('<iframe width="' + t.parents('.slide').outerWidth(true) + '" height="' + t.parents('.slide').outerHeight(true) + '" src="' + videoId(t.prev('img').attr('data-videoUrl')).site + videoId(t.prev('img').attr('data-videoUrl')).id + '?rel=0&autoplay=1&fullscreen=0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
    });
    jQuery(rS).on('mousedown', '.close-video', function(){
        var t = jQuery(this);
        t.parents('.raxus-slider').find('.play-button, img, .slide .text, .fullscreen').show(0);
        t.parents('.raxus-slider[data-dots]').find('ul.dots').show(0);
        t.parent().find('iframe').remove();
        t.remove();
        t.parents('.raxus-slider').removeAttr('data-playing');
    });

    // fix caption text
    jQuery(rS+' .text strong').after('<div class="clear"></div>');
    
    // other appends
    jQuery(rS+' .slide .image').prepend('<div class="vertical-helper"></div>'); // vertical align middle
    jQuery(rS+'[data-bgcolor]').each(function(){
        jQuery(this).find('.slider-area .slider-relative .slide').css('background-color', jQuery(this).attr('data-bgcolor'));
    });
    jQuery(rS+'[data-thumbbgcolor]').each(function() {
        jQuery(this).find('.mini-images').css('background-color', jQuery(this).attr('data-thumbbgcolor'));
    });

    // slide button actions
    jQuery(document).on('click', '.arrow-r', function(){
        raxusSliderGlobal(this, '-');
    });
    jQuery(document).on('click', '.arrow-l', function(){
        raxusSliderGlobal(this, '+');
    });
    
    // dot button action
    jQuery(document).on('mouseup touchend', '.dots li, .mini-images:not(.no-transition) li', function(){
        raxusSliderGlobal(this, 'dot');
    });

    // touch moves actions
    //////////////////////
    var startX, thumb, direction, slideWhere, finishLeft, finishTop, finish = 0;

    function dirAndThumb(that) {
        var dataThumbnail = jQuery(that).parents('.raxus-slider').attr('data-thumbnail'),
        dataDirection = jQuery(that).parents('.raxus-slider').attr('data-direction');
        thumb = dataThumbnail == 'left' || dataThumbnail == 'right';
        direction = dataDirection == 'vertical';
    }

    function touching(a) {
        dirAndThumb(a);
        if ( a.className == 'slider-relative' ) { 
            slideWhere = direction ? parseInt(jQuery(a).position().top) : parseInt(jQuery(a).position().left); 
        } else if ( a.className == 'mini-images' ) {
            slideWhere = thumb ? parseInt(jQuery(a).position().top)-10 : parseInt(jQuery(a).position().left)-10; 
        }
        startX = 0;
        finishLeft = -(jQuery(a).find('li').outerWidth(true) * (jQuery(a).find('li').size()-1)) + ( jQuery(a).parents('.mini-images-relative').outerWidth(true) - jQuery(a).find('li').outerWidth(true) )-10;
        finishTop = -(jQuery(a).find('li').outerHeight(true) * (jQuery(a).find('li').size()-1)) + ( jQuery(a).parents('.mini-images-relative').outerHeight(true) - jQuery(a).find('li').outerHeight(true) )-10;
        finish = thumb ? finishTop : finishLeft;
    }

    function touchable(that, b, e, event) {
        var ifA = parseInt(event.pageY) - parseInt(e.pageY), ifB = parseInt(event.pageX) - parseInt(e.pageX);
        jQuery(that).addClass('no-transition');
        if ( that.className == 'slider-relative no-transition' ) {
            var endPoint = direction ? jQuery('.slide').outerHeight(true) : jQuery('.slide').outerWidth(true);
            if ( -(startX - b) < -(endPoint * (jQuery('.slide').size()-1)) || -(startX - b) > 0 ) {
                ifA = ifA/12, ifB = ifB/12;
            }
            startX = direction ? ifA : ifB;
            var tWay = direction ? ('0, ' + (b + -(startX)) + 'px') : (b + -(startX) + 'px, 0');
        } else if ( that.className == 'mini-images no-transition' ) {
            var endPoint = direction ? $('.mini-images li').outerWidth(true) : $('.mini-images li').outerHeight(true);
            if ( -(startX - b) > 0 ) {
                var tWay = thumb ? ('0, 0') : ('0, 0');
            } else if ( -(startX - b) < finish ) {
                var tWay = thumb ? ('0,' + finish + 'px') : (finish + 'px, 0');
            } else {
                startX = thumb ? ifA : ifB;
                var tWay = thumb ? ('0, ' + (b + -(startX)) + 'px') : (b + -(startX) + 'px, 0');
            }
        }
        move(jQuery(that), tWay);
    }

    // mouse touching
    jQuery(document).on('mousedown', rS + ' .slider-relative, ' + rS + ' .mini-images:not(.no-slide)', function(event) {
        event.preventDefault();
        touching(this);
        jQuery(this).on('mousemove', function(e) { touchable(this, slideWhere, e, event) });
    });

    // mobile touching
    jQuery(rS + ' .slider-relative, ' + rS + ' .mini-images:not(.no-slide)').map(function() {
        this.addEventListener('touchstart', function(event) {
            if ( jQuery(rS + ' .slider-relative, ' + rS).attr('data-direction') == 'vertical' ) { event.preventDefault(); }
            touching(this);
            this.addEventListener('touchmove', function(e) { touchable(this, slideWhere, e.touches[0], event) }, false);
        }, false);
    });

    // big images mouse and mobile touchend
    jQuery(document).on('mouseup touchend', rS + ' .slider-relative', function() {
        jQuery(this).off('mousemove touchmove').removeClass('no-transition');
        var thatR = jQuery(this).parents('.raxus-slider').find('.arrow-r'), thatL = jQuery(this).parents('.raxus-slider').find('.arrow-l');
        if ( -(startX) < (-100) ) { raxusSliderGlobal(thatR, '-'); }
        else if ( -(startX) > 100 ) { raxusSliderGlobal(thatL, '+'); }
        rePositioning();
    });

    // mini images mouse and mobile touchend
    jQuery(document).on('mouseup touchend', rS + ' .mini-images', function(event) {
        jQuery(this).off('mousemove touchmove').removeClass('no-transition');
        var endDir = thumb ? jQuery(this).position().top : jQuery(this).position().left;
        if ( endDir > -10 ) {
            move(jQuery(this), ('0, 0') );
        } else if ( endDir <= finish ) {
            finish = thumb ? ('0, ' + finish + 'px') : (finish + 'px, 0');
            move(jQuery(this), finish )
        }
    });

    // disable redirect links when slide
    var link = true;
    jQuery(rS + ' .slide a').on({
        mousedown: function() {
            link = true;
            jQuery(window).mousemove(function(){ link = false });
        },
        click: function(e) {
            if ( link == false )
                e.preventDefault();
        }
    });

    // slide with keyboard buttons action
    jQuery('.raxus-slider').keydown(function(event) {
        if ( event.which == 39 ) {
            raxusSliderGlobal('[data-keypress=true]:focus .arrow-r', '-');
        } else if ( event.which == 37 ) {
            raxusSliderGlobal('[data-keypress=true]:focus .arrow-l', '+');
        }
    });

    // fullscreen mode actions
    jQuery(document).on('click touchstart', '.fullscreen', function(){
        jQuery(this).parents('.raxus-slider').focus();
        var id = jQuery(this).parents('.raxus-slider').attr('id');
        var elem = document.getElementById(id);
        if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) { 
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    });

    document.addEventListener("fullscreenchange", function () { if (document.fullscreenElement){ rePositioning() } else { rePositioning() } }, false);
    document.addEventListener("msfullscreenchange", function () { if (document.msFullscreenElement){ rePositioning() } else { rePositioning() } }, false);
    document.addEventListener("mozfullscreenchange", function () { if (document.mozFullScreen){ rePositioning() } else { rePositioning() } }, false);
    document.addEventListener("webkitfullscreenchange", function () { if (document.webkitIsFullScreen){ rePositioning() } else { rePositioning() } }, false);

    // when window resize
    jQuery(window).resize(function(){
        rePositioning();
    });

});