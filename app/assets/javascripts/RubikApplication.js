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
       
        pressed_cub, released_cub,
      
        colors = {
            inside: 0x2c2c2c,
            top: 0xFFFFFF,
            bottom: 0xFFD500,
            left: 0x009E60,
            right: 0x0051BA,
            front: 0xC41E3A,
            back: 0xFF5800
        };
    
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
    

    function onPadMouseMove( event ) 
    {
        if (event.clientX>padw || event.clientX<0 || event.clientY>padh || event.clientY<0) return;
     
        mouseX=(( event.clientX / padw ) * 2 - 1);
        targetRotationY=mouseX;
        mouseY=(( event.clientY / padh ) * 2 - 1);
        targetRotationX=mouseY;
        cross.style.left=(event.clientX-cw2)+'px';
        cross.style.top=(event.clientY-ch2)+'px';
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
        container.removeEventListener( 'mouseup', onDocumentMouseUp, false );
        container.removeEventListener( 'mouseout', onDocumentMouseOut, false );
    }

    var multx = 0.5*Math.PI;
    var multy = -Math.PI;
    
    function animate() 
    {
        requestAnimationFrame( animate );

        camera.position.x = rad * Math.sin( targetRotationY*multy ) * Math.cos( targetRotationX*multx );
        camera.position.y = rad * Math.sin( targetRotationX*multx );
        camera.position.z = rad * Math.cos( targetRotationY*multy ) * Math.cos( targetRotationX*multx );
        camera.lookAt( scene.position );
        TWEEN.update();
        renderer.render( scene, camera );
    }

    var self={
    
        init : function() {
            
            container = document.getElementById('container');
            pad = document.getElementById('pad');
            cross = document.getElementById('cross');
            newbt = document.getElementById('newrubik');
            scramblebt = document.getElementById('scramble');
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

            camera = new THREE.PerspectiveCamera( 50, w / h, 1, 1000 );
            camera.position.z = rad;
            scene.add( camera );
            
            projector = new THREE.Projector();

            // Rubik Cube
            rubikcube = new Rubik(rubikN, 200, 0.3, colors);
            scene.add( rubikcube );
            rubikcube.onChange = updateflatimage;
            
            renderer = new THREE.CanvasRenderer();
            renderer.setSize( w, h );

            container.appendChild( renderer.domElement );

            $(document).keypress(function(e) {
                var keyCode = e.keyCode;

                if(keyCode == 87 || keyCode == 119){
                    console.log("You pressed w/W!");
                    // FRONT COUNTER CLOCKWISE
                    rubikcube.rotate({axis:"z",row:1,angle:1,duration:2});
                }
                if(keyCode == 88 || keyCode == 120){
                    console.log("You pressed X/x!");
                    // FRONT CLOCKWISE
                    rubikcube.rotate({axis:"z",row:1,angle:-1,duration:2});
                }

                if(keyCode == 111 || keyCode == 79){
                    console.log("You pressed o/O!");
                    // BACK CLOCKWISE
                    rubikcube.rotate({axis:"z",row:0,angle:1,duration:2});
                }
                if(keyCode == 112 || keyCode == 80){
                    console.log("You pressed p/P!");
                    // BACK COUNTER CLOCKWISE
                    rubikcube.rotate({axis:"z",row:0,angle:-1,duration:2});
                }

                if(keyCode == 97 || keyCode == 65){
                    console.log("You pressed a/A!");
                    // TOP COUNTER CLOCKWISE
                    rubikcube.rotate({axis:"y",row:1,angle:1,duration:2});
                }
                if(keyCode == 115 || keyCode == 83){
                    console.log("You pressed s/S!");
                    // TOP CLOCKWISE
                    rubikcube.rotate({axis:"y",row:1,angle:-1,duration:2});
                }

                if(keyCode == 98 || keyCode == 66){
                    console.log("You pressed b/B!");
                    // BOTTOM COUNTER CLOCKWISE
                    rubikcube.rotate({axis:"y",row:0,angle:-1,duration:2});
                }
                if(keyCode == 110 || keyCode == 78){
                    console.log("You pressed n/N!");
                    // BOTTOM CLOCKWISE
                    rubikcube.rotate({axis:"y",row:0,angle:1,duration:2});
                }

                if(keyCode == 116 || keyCode == 84){
                    console.log("You pressed T/t!");
                    // RIGHT COUNTER CLOCKWISE
                    rubikcube.rotate({axis:"x",row:1,angle:1,duration:2});
                }
                if(keyCode == 121 || keyCode == 89){
                    console.log("You pressed y/Y!");
                    // RIGHT CLOCKWISE
                    rubikcube.rotate({axis:"x",row:1,angle:-1,duration:2});
                }

                if(keyCode == 106 || keyCode == 74){
                    console.log("You pressed j/J!");
                    // LEFT COUNTER CLOCKWISE
                    rubikcube.rotate({axis:"x",row:0,angle:-1,duration:2});
                }
                if(keyCode == 107 || keyCode == 75){
                    console.log("You pressed k/K!");
                    // LEFT CLOCKWISE
                    rubikcube.rotate({axis:"x",row:0,angle:1,duration:2});
                }
     
            });

            
            pad.addEventListener( 'mousedown', onPadMouseDown, false );
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
            
            renderer.render( scene, camera );
            updateflatimage();
            
            animate();
        },
        
        animate : animate
    
    };
    
    // export it
    window.RubikApplication = self;
    
})(window, jQuery);