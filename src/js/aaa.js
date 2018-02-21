const THREE = require('three-js')([
    'EffectComposer',
    'RenderPass',
    'ShaderPass',
    'CopyShader',
    'OrbitControls'
]);

const glslify = require('glslify');
const glShader = require('gl-shader');
// const vertex = 'void main(){gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );}';
// const fragment = glslify('./shader/base.frag');


const shader = glShader(gl, 
    glslify('./shader.vert'),
    glslify('./shader.frag')
)

console.log(shader)

window.onload = function () {
    let renderer;
    
    let camera;
    let scene;
    let clock;
    let windowWidth;
    let windowHeight;
    let aspect;
    let time;
    let light;
    let dLight;
    let mesh;
    let controls;
    let composer;
    let renderPass;

    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    aspect = windowWidth / windowHeight;
    clock = new THREE.Clock();
    time = 0;

    let media = navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
    });
    let video = document.querySelector('video');

    media.then(function (stream) {
        video.src = window.URL.createObjectURL(stream);
        video.onloadedmetadata = function (e) {
            setup();
            // Do something with the video here.

        };
    });

    media.catch(function (e) {
        console.log(e.name);
    });

    let setup = function () {
        let videoTexture = new THREE.Texture(video);
        videoTexture.minFilter = THREE.LinearFilter;
        videoTexture.magFilter = THREE.LinearFilter;
        videoTexture.format = THREE.RGBFormat;
        // let videoMaterial = new THREE.MeshBasicMaterial({
        //     map: videoTexture
        // });

        let videoMaterial = new THREE.ShaderMaterial({
            vertexShader: vertex,
            fragmentShader: fragment,
            uniforms: {

            },
        });

        // rendererの作成
        renderer = new THREE.WebGLRenderer();
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor(new THREE.Color(0xffffff), 1.0);

        // composer = new THREE.EffectComposer(renderer);

        // canvasをbodyに追加
        document.body.appendChild(renderer.domElement);

        // canvasをリサイズ
        renderer.setSize(windowWidth, windowHeight);

        // ベースの描画処理（renderTarget への描画用）
        scene = new THREE.Scene();

        //LIGHTS
        light = new THREE.AmbientLight(0xffffff, 1.0);
        scene.add(light);

        dLight = new THREE.DirectionalLight(0xffffff, 1.0);
        dLight.position.set(0, 5, 5).normalize();
        scene.add(dLight);

        //ベースの描画処理用カメラ                      
        camera = new THREE.PerspectiveCamera(60, windowWidth / windowHeight, 0.1, 1000);
        camera.position.z = 1.5;

        controls = new THREE.OrbitControls(camera);

        let geometry = new THREE.SphereBufferGeometry(0.5, 24, 24);
        //let geometry = new THREE.PlaneGeometry(1, 1, 1,1);
        mesh = new THREE.Mesh(geometry, videoMaterial);
        mesh.rotation.set(25 * Math.PI / 180, -90 * Math.PI / 180, 0);
        scene.add(mesh);

        // renderPass = new THREE.RenderPass(scene, camera);
        // composer.addPass(renderPass);

        // //カスタムシェーダー
        // let myEffect = {
        //     uniforms: {
        //         "tDiffuse": {
        //             value: null
        //         }
        //         // "amount": {
        //         //     value: 1.0
        //         // }
        //     },
        //     vertexShader: vertex,
        //     fragmentShader:fragment
        // };

        // //エフェクト結果をスクリーンに描画する
        // let customPass = new THREE.ShaderPass(myEffect);
        // customPass.renderToScreen = true;
        // composer.addPass(customPass);


        render();


    }


    function render() {

        //mesh.material.map.needsUpdate = true;

        mesh.rotation.y += 0.01;

        time = clock.getElapsedTime();

        renderer.render(scene, camera);

        controls.update();

        requestAnimationFrame(render);
    }
}