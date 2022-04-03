import { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import space from "../../img/space.jpg";
import cygas from "../../img/toja.png";
import moon from "../../img/moon.jpg";
import "./style.css";

export const Playground = () => {
  const canvasRef = useRef();

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.setZ(30);

    const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
    const material = new THREE.MeshStandardMaterial({
      color: 0x7dcad4,
    });
    const torus = new THREE.Mesh(geometry, material);

    const pointLight = new THREE.PointLight(0xffffff);
    const ambientLight = new THREE.AmbientLight(0xffffff);

    pointLight.position.set(20, 20, 20);

    const controls = new OrbitControls(camera, renderer.domElement);

    const spaceTexture = new THREE.TextureLoader().load(space);
    scene.background = spaceTexture;

    const cygasTexture = new THREE.TextureLoader().load(cygas);
    const cygasBox = new THREE.Mesh(
      new THREE.BoxGeometry(3, 3, 3),
      new THREE.MeshBasicMaterial({ map: cygasTexture })
    );
    cygasBox.position.z = -5;

    const planetTexture = new THREE.TextureLoader().load(moon);
    const planet = new THREE.Mesh(
      new THREE.SphereGeometry(3, 32, 32),
      new THREE.MeshStandardMaterial({
        map: planetTexture,
      })
    );
    planet.position.z = 30;
    planet.position.setX(-10);

    scene.add(torus, pointLight, ambientLight, planet, cygasBox);

    const addStar = () => {
      const starGeometry = new THREE.SphereGeometry(0.25, 24, 24);
      const starMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const star = new THREE.Mesh(starGeometry, starMaterial);

      const [x, y, z] = Array(3)
        .fill()
        .map(() => THREE.MathUtils.randFloatSpread(100));

      star.position.set(x, y, z);
      scene.add(star);
    };

    Array(200)
      .fill()
      .forEach(() => addStar());

    const moveCamera = () => {
      const t = document.body.getBoundingClientRect().top;

      planet.rotation.x += 0.05;
      planet.rotation.y += 0.075;
      planet.rotation.z += 0.05;

      cygasBox.rotation.y += 0.01;
      cygasBox.rotation.z += 0.01;

      camera.position.z = t * -0.01;
      camera.position.x = t * -0.0002;
      camera.position.y = t * -0.0002;
    };

    document.body.onscroll = moveCamera;
    moveCamera();

    const animate = () => {
      requestAnimationFrame(animate);

      torus.rotation.x += 0.01;
      torus.rotation.y += 0.005;
      torus.rotation.z += 0.01;

      controls.update();

      renderer.render(scene, camera);
    };

    animate();
  }, []);

  return <canvas className="canvas" ref={canvasRef} />;
};
