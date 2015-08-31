(function(window, $, undef){
    
    /**
     * Provides requestAnimationFrame in a cross browser way.
     * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
     */

    if ( !window.requestAnimationFrame ) {

        window.requestAnimationFrame = ( function() {

            return window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {

                window.setTimeout( callback, 1000 / 60 );

            };

        } )();

    }
    
    var 
        container, pad, cross, 
        scramblebt, undobt, newbt, 
        flatimage, rubikN,
        padw = 100, padh = 100, pad2x = 50, pad2y = 50,
        cw = 20, ch = 20, cw2 = 10, ch2 = 10,
        camera, scene, renderer, projector,

        rubikcube,

        targetRotationY = 0, targetRotationOnMouseDownY = 0, targetRotationX = 0, targetRotationOnMouseDownX = 0,
        rad = 500, mouse = {x:0,y:0}, mouseX = 0, mouseXOnMouseDown = 0, mouseY = 0, mouseYOnMouseDown = 0,

        windowHalfX = window.innerWidth / 2, windowHalfY = window.innerHeight / 2,
        w, h, w2, h2,
        cstop, csbottom, csleft, csright, csfront, csback, csinside,
        cstope, csbottome, cslefte, csrighte, csfronte, csbacke, csinsidee,
        pressed_cub, released_cub,
        // mutually complementary colors
        colors = {
            inside: 0x2c2c2c,
            top: 0xFF00FF,
            bottom: 0x00FF00,
            left: 0xFFFF00,
            right: 0x0000FF,
            front: 0xFF0000,
            back: 0x00FFFF
        }
    ;
        
    function toHex(col)
    {
        var hx, hl, prefix = '', i;
        
        if (col.substr)   hx = col;
        
        else  hx = col.toString(16);
        
        hl = hx.length;
        for (i=0; i<6-hl; i++)
            prefix += '0';
        return('#' + prefix + hx);
    }
    
    function cstop_change_update(hsb, hex, rgb) 
    {
        var bb=colors.top;
        colors.top=parseInt(hex,16);
        if (rubikcube.setRubikColors({colors:colors}))
        {
            cstope.style.backgroundColor=toHex(hex);
            updateflatimage();
        }
        else
            colors.top=bb;
        $(cstope).ColorPickerHide();
    }
    
    function csbottom_change_update(hsb, hex, rgb) 
    {
        var bb=colors.bottom;
        colors.bottom=parseInt(hex,16);
        if (rubikcube.setRubikColors({colors:colors}))
        {
            csbottome.style.backgroundColor=toHex(hex);
            updateflatimage();
        }
        else
            colors.bottom=bb;
        $(csbottome).ColorPickerHide();
    }
    
    function csleft_change_update(hsb, hex, rgb) 
    {
        var bb=colors.left;
        colors.left=parseInt(hex,16);
        if (rubikcube.setRubikColors({colors:colors}))
        {
            cslefte.style.backgroundColor=toHex(hex);
            updateflatimage();
        }
        else
            colors.left=bb;
        $(cslefte).ColorPickerHide();
    }
    
    function csright_change_update(hsb, hex, rgb) 
    {
        var bb=colors.right;
        colors.right=parseInt(hex,16);
        if (rubikcube.setRubikColors({colors:colors}))
        {
            csrighte.style.backgroundColor=toHex(hex);
            updateflatimage();
        }
        else
            colors.right=bb;
        $(csrighte).ColorPickerHide();
    }
    
    function csfront_change_update(hsb, hex, rgb) 
    {
        var bb=colors.front;
        colors.front=parseInt(hex,16);
        if (rubikcube.setRubikColors({colors:colors}))
        {
            csfronte.style.backgroundColor=toHex(hex);
            updateflatimage();
        }
        else
            colors.front=bb;
        $(csfronte).ColorPickerHide();
    }
    
    function csback_change_update(hsb, hex, rgb) 
    {
        var bb=colors.back;
        colors.back=parseInt(hex,16);
        if (rubikcube.setRubikColors({colors:colors}))
        {
            csbacke.style.backgroundColor=toHex(hex);
            updateflatimage();
        }
        else
            colors.back=bb;
        $(csbacke).ColorPickerHide();
    }
    
    function csinside_change_update(hsb, hex, rgb) 
    {
        var bb=colors.inside;
        colors.inside=parseInt(hex,16);
        if (rubikcube.setRubikColors({colors:colors}))
        {
            csinsidee.style.backgroundColor=toHex(hex);
            updateflatimage();
        }
        else
            colors.inside=bb;
        $(csinsidee).ColorPickerHide();
    }
    
    function updatecolors()
    {
        cstope.style.backgroundColor = toHex(colors.top);
        csbottome.style.backgroundColor = toHex(colors.bottom);
        cslefte.style.backgroundColor = toHex(colors.left);
        csrighte.style.backgroundColor = toHex(colors.right);
        csfronte.style.backgroundColor = toHex(colors.front);
        csbacke.style.backgroundColor = toHex(colors.back);
        csinsidee.style.backgroundColor = toHex(colors.inside);
    }
    
    function cs_init() 
    {
        cstope = document.getElementById("cstop1");
        csbottome = document.getElementById("csbottom1");
        cslefte = document.getElementById("csleft1");
        csrighte = document.getElementById("csright1");
        csfronte = document.getElementById("csfront1");
        csbacke = document.getElementById("csback1");
        csinsidee = document.getElementById("csinside1");
        
        updatecolors();
        
        $(cstope).ColorPicker({
            onSubmit: cstop_change_update,
            onBeforeShow: function () {
                $(this).ColorPickerSetColor(colors.top.toString(16));
            },
            onShow: function (colpkr) {
                $(colpkr).fadeIn(500);
                return false;
            }
        });
        
        $(csbottome).ColorPicker({
            onSubmit: csbottom_change_update,
            onBeforeShow: function () {
                $(this).ColorPickerSetColor(colors.bottom.toString(16));
            },
            onShow: function (colpkr) {
                $(colpkr).fadeIn(500);
                return false;
            }
        });
        
        $(cslefte).ColorPicker({
            onSubmit: csleft_change_update,
            onBeforeShow: function () {
                $(this).ColorPickerSetColor(colors.left.toString(16));
            },
            onShow: function (colpkr) {
                $(colpkr).fadeIn(500);
                return false;
            }
        });
        
        $(csrighte).ColorPicker({
            onSubmit: csright_change_update,
            onBeforeShow: function () {
                $(this).ColorPickerSetColor(colors.right.toString(16));
            },
            onShow: function (colpkr) {
                $(colpkr).fadeIn(500);
                return false;
            }
        });
        
        $(csfronte).ColorPicker({
            onSubmit: csfront_change_update,
            onBeforeShow: function () {
                $(this).ColorPickerSetColor(colors.front.toString(16));
            },
            onShow: function (colpkr) {
                $(colpkr).fadeIn(500);
                return false;
            }
        });
        
        $(csbacke).ColorPicker({
            onSubmit: csback_change_update,
            onBeforeShow: function () {
                $(this).ColorPickerSetColor(colors.back.toString(16));
            },
            onShow: function (colpkr) {
                $(colpkr).fadeIn(500);
                return false;
            }
        });
        
        $(csinsidee).ColorPicker({
            onSubmit: csinside_change_update,
            onBeforeShow: function () {
                $(this).ColorPickerSetColor(colors.inside.toString(16));
            },
            onShow: function (colpkr) {
                $(colpkr).fadeIn(500);
                return false;
            }
        });
    }
    
    function updateflatimage()
    {
        var flat = rubikcube.getFlatImage(flatimage);
    }
    
    function getCubelet(event)
    {
        mouse.x = ( event.clientX / w ) * 2 - 1;
        mouse.y = - ( event.clientY / h ) * 2 + 1;
        var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
        projector.unprojectVector( vector, camera );

        var ray = new THREE.Ray( camera.position, vector.subSelf( camera.position ).normalize() );

        var intersects = ray.intersectObjects( rubikcube.children );

        if ( intersects.length > 0 ) {
            return({cubelet:intersects[0].object,face:intersects[0].face, ray:ray,vector:vector});
        }
        return(null);
    }
    
/*  function onDblClick( event )
    {
        event.preventDefault();
        
        var target=getCubelet(event);
        if ( target!=null ) {

            var foo=rubikcube.getFacesAsSeen(target.cubelet).faceseenas;
            var str='';
            for (var prop in foo)
            {
             if (prop==null) continue;
             str+=prop+" ==> "+foo[prop]+'\n';
            }
            alert(str);
        }
    }*/

    function onPadMouseDown( event ) 
    {
        event.preventDefault();

        pad.addEventListener( 'mousemove', onPadMouseMove, false );
        pad.addEventListener( 'mouseup', onPadMouseUp, false );
        pad.addEventListener( 'mouseout', onPadMouseOut, false );
        
        //mouseXOnMouseDown = event.clientX - pad2x;
        //mouseYOnMouseDown = event.clientY - pad2y;
        //mouseX = event.clientX - pad2x;
        //mouseY = event.clientY - pad2y;
        //targetRotationY = (mouseX/pad2x)*Math.PI;
        //targetRotationX = (mouseY/pad2y)*Math.PI;
        
        mouseX=(( event.clientX / padw ) * 2 - 1);
        targetRotationY=mouseX;
        mouseY=(( event.clientY / padh ) * 2 - 1);
        targetRotationX=mouseY;
        
        targetRotationOnMouseDownY = targetRotationY;
        targetRotationOnMouseDownX = targetRotationX;
        cross.style.left=(event.clientX-cw2)+'px';
        cross.style.top=(event.clientY-ch2)+'px';
    }
    
    function onDocumentMouseDown( event ) 
    {
        event.preventDefault();
        var target=getCubelet(event);
        if (target==null) return;
        var cubeletseenas=rubikcube.getCubeletSeenCoords(target.cubelet);
        var f=rubikcube.getFacesAsSeen(target.cubelet);
        if (f==null) return;
        var matname=target.cubelet.geometry.materials[target.face.materialIndex].name;
        pressed_cub={cub:target.cubelet,seenas:{name:f.faceseenas[matname],xx:cubeletseenas.xx,yy:cubeletseenas.yy,zz:cubeletseenas.zz},ray:target.ray,vector:target.vector};
        
        //container.addEventListener( 'mousemove', onDocumentMouseMove, false );
        container.addEventListener( 'mouseup', onDocumentMouseUp, false );
        container.addEventListener( 'mouseout', onDocumentMouseOut, false );
        /*
        mouseXOnMouseDown = event.clientX - w2;
        mouseYOnMouseDown = event.clientY - h2;

        targetRotationY = targetRotationOnMouseDownY + ( mouseX - mouseXOnMouseDown ) * 0.02;
        targetRotationX = targetRotationOnMouseDownX + ( mouseY - mouseYOnMouseDown ) * 0.02;
        targetRotationOnMouseDownY = targetRotationY;
        targetRotationOnMouseDownX = targetRotationX;*/
    }

    function onPadMouseMove( event ) 
    {
        if (event.clientX>padw || event.clientX<0 || event.clientY>padh || event.clientY<0) return;
        //mouseX = event.clientX - pad2x;
        //mouseY = event.clientY - pad2y;

        //targetRotationY = (mouseX/pad2x)*Math.PI;
        //targetRotationX = (mouseY/pad2y)*Math.PI;
        mouseX=(( event.clientX / padw ) * 2 - 1);
        targetRotationY=mouseX;
        mouseY=(( event.clientY / padh ) * 2 - 1);
        targetRotationX=mouseY;
        cross.style.left=(event.clientX-cw2)+'px';
        cross.style.top=(event.clientY-ch2)+'px';
    }
    
    function onDocumentMouseMove( event ) 
    {
        /*mouseX = event.clientX - w2;
        mouseY = event.clientY - h2;

        targetRotationY = targetRotationOnMouseDownY + ( mouseX - mouseXOnMouseDown ) * 0.02;
        targetRotationX = targetRotationOnMouseDownX + ( mouseY - mouseYOnMouseDown ) * 0.02;*/
        //var target=
        //mouse_path.push(e.seenas.ray);
    }

    function onPadMouseUp( event ) 
    {
        cross.style.left=(event.clientX-cw2)+'px';
        cross.style.top=(event.clientY-ch2)+'px';
        pad.removeEventListener( 'mousemove', onPadMouseMove, false );
        pad.removeEventListener( 'mouseup', onPadMouseUp, false );
        pad.removeEventListener( 'mouseout', onPadMouseOut, false );
    }

    function range(what, min, max)
    {
        if (what < max && what > min) return true;
        return false;
    }
    
    function onDocumentMouseUp( event ) 
    {
        var target = getCubelet(event);
        if (target==null) return;
        var cubeletseenas = rubikcube.getCubeletSeenCoords(target.cubelet);
        var f = rubikcube.getFacesAsSeen(target.cubelet);
        if (f==null) return;
        var matname = target.cubelet.geometry.materials[target.face.materialIndex].name;
        released_cub = {
            cub: target.cubelet,
            seenas: {
                name: f.faceseenas[matname],
                xx: cubeletseenas.xx,
                yy: cubeletseenas.yy,
                zz: cubeletseenas.zz
            },
            ray: target.ray,
            vector: target.vector
        };
        var N = rubikcube.rubik.N;
        var prev_ray = pressed_cub.vector;
        var now_ray = released_cub.vector;
        var angle = -1;
        var nn = now_ray.subSelf(prev_ray);
        
        if (pressed_cub.seenas.name==released_cub.seenas.name)
        {
            switch(pressed_cub.seenas.name)
            {
                case 'right':
                case 'left':
                    //if (pressed_cub.seenas.yy==1 && released_cub.seenas.yy==1)
                    if (range(pressed_cub.seenas.yy,0,N-1) && range(released_cub.seenas.yy,0,N-1))
                    {
                        if (nn.z>0) angle=-angle;
                        if (pressed_cub.seenas.name=='right') angle=-angle;
                        rubikcube.rotate({axis:"y",row:pressed_cub.seenas.yy,angle:angle,duration:2/*,onComplete:updateflatimage*/});
                    }
                    //else if (pressed_cub.seenas.zz==1 && released_cub.seenas.zz==1)
                    else if (range(pressed_cub.seenas.zz,0,N-1) && range(released_cub.seenas.zz,0,N-1))
                    {
                        if (nn.x<0) angle=-angle;
                        rubikcube.rotate({axis:"z",row:pressed_cub.seenas.zz,angle:angle,duration:2/*,onComplete:updateflatimage*/});
                    }
                    //else if (pressed_cub.seenas.yy==2 && released_cub.seenas.yy==2)
                    else if (pressed_cub.seenas.yy==N-1 && released_cub.seenas.yy==N-1)
                    {
                        if (nn.z>0) angle=-angle;
                        rubikcube.rotate({axis:"x",row:pressed_cub.seenas.xx,angle:angle,duration:2/*,onComplete:updateflatimage*/});
                    }
                    else if (pressed_cub.seenas.yy==0 && released_cub.seenas.yy==0)
                    {
                        if (nn.z>0) angle=-angle;
                        rubikcube.rotate({axis:"x",row:pressed_cub.seenas.xx,angle:-angle,duration:2/*,onComplete:updateflatimage*/});
                    }
                    else if (pressed_cub.seenas.zz==0 && released_cub.seenas.zz==0)
                    {
                        if (nn.y>0) angle=-angle;
                        rubikcube.rotate({axis:"x",row:pressed_cub.seenas.xx,angle:angle,duration:2/*,onComplete:updateflatimage*/});
                    }
                    //else if (pressed_cub.seenas.zz==2 && released_cub.seenas.zz==2)
                    else if (pressed_cub.seenas.zz==N-1 && released_cub.seenas.zz==N-1)
                    {
                        if (nn.y>0) angle=-angle;
                        rubikcube.rotate({axis:"x",row:pressed_cub.seenas.xx,angle:-angle,duration:2/*,onComplete:updateflatimage*/});
                    }
                    break;
                case 'top':
                case 'bottom':
                    //if (pressed_cub.seenas.zz==1 && released_cub.seenas.zz==1)
                    if (range(pressed_cub.seenas.zz,0,N-1) && range(released_cub.seenas.zz,0,N-1))
                    {
                        if (nn.x>0) angle=-angle;
                        if (pressed_cub.seenas.name=='top') angle=-angle;
                        rubikcube.rotate({axis:"z",row:pressed_cub.seenas.zz,angle:angle,duration:2/*,onComplete:updateflatimage*/});
                    }
                    //else if (pressed_cub.seenas.xx==1 && released_cub.seenas.xx==1)
                    else if (range(pressed_cub.seenas.xx,0,N-1) && range(released_cub.seenas.xx,0,N-1))
                    {
                        if (nn.z<0) angle=-angle;
                        if (pressed_cub.seenas.name=='bottom') angle=-angle;
                        rubikcube.rotate({axis:"x",row:pressed_cub.seenas.xx,angle:-angle,duration:2/*,onComplete:updateflatimage*/});
                    }
                    //else if (pressed_cub.seenas.zz==2 && released_cub.seenas.zz==2)
                    else if (pressed_cub.seenas.zz==N-1 && released_cub.seenas.zz==N-1)
                    {
                        if (nn.x<0) angle=-angle;
                        rubikcube.rotate({axis:"y",row:pressed_cub.seenas.yy,angle:-angle,duration:2/*,onComplete:updateflatimage*/});
                    }
                    else if (pressed_cub.seenas.zz==0 && released_cub.seenas.zz==0)
                    {
                        if (nn.x<0) angle=-angle;
                        rubikcube.rotate({axis:"y",row:pressed_cub.seenas.yy,angle:angle,duration:2/*,onComplete:updateflatimage*/});
                    }
                    //else if (pressed_cub.seenas.xx==2 && released_cub.seenas.xx==2)
                    else if (pressed_cub.seenas.xx==N-1 && released_cub.seenas.xx==N-1)
                    {
                        if (nn.z<0) angle=-angle;
                        //if (pressed_cub.seenas.name=='bottom') angle=-angle;
                        rubikcube.rotate({axis:"y",row:pressed_cub.seenas.yy,angle:angle,duration:2/*,onComplete:updateflatimage*/});
                    }
                    else if (pressed_cub.seenas.xx==0 && released_cub.seenas.xx==0)
                    {
                        if (nn.z<0) angle=-angle;
                        //if (pressed_cub.seenas.name=='bottom') angle=-angle;
                        rubikcube.rotate({axis:"y",row:pressed_cub.seenas.yy,angle:-angle,duration:2/*,onComplete:updateflatimage*/});
                    }
                    break;
                case 'back':
                case 'front':
                    //if (pressed_cub.seenas.yy==1 && released_cub.seenas.yy==1)
                    if (range(pressed_cub.seenas.yy,0,N-1) && range(released_cub.seenas.yy,0,N-1))
                    {
                        if (nn.x<0) angle=-angle;
                        if (pressed_cub.seenas.name=='back') angle=-angle;
                        rubikcube.rotate({axis:"y",row:pressed_cub.seenas.yy,angle:-angle,duration:2/*,onComplete:updateflatimage*/});
                    }
                    //else if (pressed_cub.seenas.xx==1 && released_cub.seenas.xx==1)
                    else if (range(pressed_cub.seenas.xx,0,N-1) && range(released_cub.seenas.xx,0,N-1))
                    {
                        if (nn.y<0) angle=-angle;
                        if (pressed_cub.seenas.name=='back') angle=-angle;
                        rubikcube.rotate({axis:"x",row:pressed_cub.seenas.xx,angle:angle,duration:2/*,onComplete:updateflatimage*/});
                    }
                    //else if (pressed_cub.seenas.yy==2 && released_cub.seenas.yy==2)
                    else if (pressed_cub.seenas.yy==N-1 && released_cub.seenas.yy==N-1)
                    {
                        if (nn.x>0) angle=-angle;
                        //if (pressed_cub.seenas.name=='back') angle=-angle;
                        rubikcube.rotate({axis:"z",row:pressed_cub.seenas.zz,angle:-angle,duration:2/*,onComplete:updateflatimage*/});
                    }
                    else if (pressed_cub.seenas.yy==0 && released_cub.seenas.yy==0)
                    {
                        if (nn.x>0) angle=-angle;
                        //if (pressed_cub.seenas.name=='back') angle=-angle;
                        rubikcube.rotate({axis:"z",row:pressed_cub.seenas.zz,angle:angle,duration:2/*,onComplete:updateflatimage*/});
                    }
                    //else if (pressed_cub.seenas.xx==2 && released_cub.seenas.xx==2)
                    else if (pressed_cub.seenas.xx==N-1 && released_cub.seenas.xx==N-1)
                    {
                        if (nn.y<0) angle=-angle;
                        //if (pressed_cub.seenas.name=='back') angle=-angle;
                        rubikcube.rotate({axis:"z",row:pressed_cub.seenas.zz,angle:-angle,duration:2/*,onComplete:updateflatimage*/});
                    }
                    else if (pressed_cub.seenas.xx==0 && released_cub.seenas.xx==0)
                    {
                        if (nn.y<0) angle=-angle;
                        //if (pressed_cub.seenas.name=='back') angle=-angle;
                        rubikcube.rotate({axis:"z",row:pressed_cub.seenas.zz,angle:angle,duration:2/*,onComplete:updateflatimage*/});
                    }
                    break;
            }
        }
        //container.removeEventListener( 'mousemove', onDocumentMouseMove, false );
        container.removeEventListener( 'mouseup', onDocumentMouseUp, false );
        container.removeEventListener( 'mouseout', onDocumentMouseOut, false );
    }
    
    function onPadMouseOut( event ) 
    {
        cross.style.left=(event.clientX-cw2)+'px';
        cross.style.top=(event.clientY-ch2)+'px';
        pad.removeEventListener( 'mousemove', onPadMouseMove, false );
        pad.removeEventListener( 'mouseup', onPadMouseUp, false );
        pad.removeEventListener( 'mouseout', onPadMouseOut, false );
    }

    function onDocumentMouseOut( event ) 
    {
        //container.removeEventListener( 'mousemove', onDocumentMouseMove, false );
        container.removeEventListener( 'mouseup', onDocumentMouseUp, false );
        container.removeEventListener( 'mouseout', onDocumentMouseOut, false );
    }
    /*
    function onDocumentTouchStart( event ) {

        if ( event.touches.length == 1 ) {

            event.preventDefault();

            mouseXOnMouseDown = event.touches[ 0 ].pageX - windowHalfX;
            targetRotationOnMouseDownY = targetRotationY;
            mouseYOnMouseDown = event.touches[ 0 ].pageY - windowHalfY;
            targetRotationOnMouseDownX = targetRotationX;

        }
    }

    function onDocumentTouchMove( event ) {

        if ( event.touches.length == 1 ) {

            event.preventDefault();

            mouseX = event.touches[ 0 ].pageX - windowHalfX;
            targetRotationY = targetRotationOnMouseDownY + ( mouseX - mouseXOnMouseDown ) * 0.05;
            mouseY = event.touches[ 0 ].pageY - windowHalfY;
            targetRotationX = targetRotationOnMouseDownX + ( mouseY - mouseYOnMouseDown ) * 0.05;

        }
    }
*/
    //

    var multx = 0.5*Math.PI;
    var multy = -Math.PI;
    
    function animate() 
    {
        requestAnimationFrame( animate );

        //rubikcube.rotation.x += ( targetRotationX - rubikcube.rotation.x ) * 0.05;
        //rubikcube.rotation.y += ( targetRotationY - rubikcube.rotation.y ) * 0.05;
        //rubikcube.rotation.x = targetRotationX;
        //rubikcube.rotation.y = targetRotationY;
        camera.position.x = rad * Math.sin( targetRotationY*multy ) * Math.cos( targetRotationX*multx );
        camera.position.y = rad * Math.sin( targetRotationX*multx );
        camera.position.z = rad * Math.cos( targetRotationY*multy ) * Math.cos( targetRotationX*multx );
        camera.lookAt( scene.position );
        TWEEN.update();
        renderer.render( scene, camera );
    }

    var self={
    
        init : function() {
            
            cs_init();
            
            container = document.getElementById('container');
            pad = document.getElementById('pad');
            cross = document.getElementById('cross');
            newbt = document.getElementById('newrubik');
            scramblebt = document.getElementById('scramble');
            undobt = document.getElementById('undo');
            flatimage = document.getElementById('flatimage');
            rubikN = 2;
            
            w = window.innerWidth;
            h = window.innerHeight;
            w2 = w/2;
            h2 = h/2;
            container.style.width = w+"px";
            container.style.height = h+"px";
            container.style.marginTop = 0.5*(window.innerHeight-h)+'px';
            
            scene = new THREE.Scene();

            camera = new THREE.PerspectiveCamera( 70, w / h, 1, 1000 );
            camera.position.z = rad;
            scene.add( camera );
            
            projector = new THREE.Projector();

            // Rubik Cube
            rubikcube = new Rubik(rubikN, 200, 0.3, colors);
            scene.add( rubikcube );
            rubikcube.onChange = updateflatimage;
            
            renderer = new THREE.CanvasRenderer();
            renderer.setSize( w, h );
            //THREEx.WindowResize(renderer, camera);

            container.appendChild( renderer.domElement );

            //container.addEventListener( 'dblclick', onDblClick, false );
            container.addEventListener( 'mousedown', onDocumentMouseDown, false );
            //container.addEventListener( 'touchstart', onDocumentTouchStart, false );
            //container.addEventListener( 'touchmove', onDocumentTouchMove, false );
            pad.addEventListener( 'mousedown', onPadMouseDown, false );
            //pad.addEventListener( 'touchstart', onDocumentTouchStart, false );
            //pad.addEventListener( 'touchmove', onDocumentTouchMove, false );
            newbt.addEventListener( 'click', function(){
                scene.remove(rubikcube); 
                rubikcube = new Rubik(rubikN, 200, 0.3, colors); 
                scene.add(rubikcube); 
                rubikcube.onChange = updateflatimage; 
                renderer.render( scene, camera );
                updateflatimage();
            }, false );
            scramblebt.addEventListener( 'click', function(){
                rubikcube.scramble(10);
                updateflatimage();
            }, false );
            undobt.addEventListener( 'click', function() {
                if (rubikcube.undo()=='setRubikColors') 
                {
                    colors = {
                        front: rubikcube.rubik.colors.front,
                        back: rubikcube.rubik.colors.back,
                        left: rubikcube.rubik.colors.left,
                        right: rubikcube.rubik.colors.right,
                        top: rubikcube.rubik.colors.top,
                        bottom: rubikcube.rubik.colors.bottom,
                        inside: rubikcube.rubik.colors.inside
                    };
                    updatecolors();
                    //updateflatimage();
                }
            }, false );
            
            // after render works
            renderer.render( scene, camera );
            updateflatimage();
            
            animate();
        },
        
        cs_init: cs_init,
        
        animate : animate
    
    };
    
    // export it
    window.RubikApplication = self;
    
})(window, jQuery);