import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ELEMENTS, CATEGORY_COLORS, ElementData } from '../../data/elements';
import {
  Atom,
  Search,
  Maximize2,
  Box,
  Globe,
  Layers,
  Sparkles,
  Info,
  X,
  Flame,
  RotateCw,
  Zap,
} from 'lucide-react';

export const PeriodicTable3DView: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const bohrMountRef = useRef<HTMLDivElement>(null);

  const [selectedElement, setSelectedElement] = useState<ElementData | null>(ELEMENTS[5]); // Default Carbon (C)
  const [layoutMode, setLayoutMode] = useState<'grid' | 'cylinder' | 'sphere'>('grid');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [organicOnly, setOrganicOnly] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(false);
  const [isInspectorOpen, setIsInspectorOpen] = useState<boolean>(true);

  // References to keep Three.js state across renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const objectsGroupRef = useRef<THREE.Group | null>(null);
  const elementMeshesRef = useRef<Map<number, THREE.Mesh>>(new Map());

  // Filtered elements list
  const filteredElements = ELEMENTS.filter((el) => {
    const matchesSearch =
      el.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      el.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      el.atomicNumber.toString().includes(searchQuery);

    const matchesCategory = selectedCategory === 'all' || el.category === selectedCategory;
    const matchesOrganic = !organicOnly || (el.organicRole && el.organicRole.length > 0);

    return matchesSearch && matchesCategory && matchesOrganic;
  });

  // Calculate coordinates for different 3D layouts
  const getCoordinates = (el: ElementData, mode: 'grid' | 'cylinder' | 'sphere') => {
    if (mode === 'grid') {
      let x = (el.group - 9.5) * 2.2;
      let y = -(el.period - 4) * 2.5;
      let z = 0;

      // Adjust Lanthanides and Actinides to standard bottom offset
      if (el.category === 'lanthanide') {
        x = (el.atomicNumber - 57 - 7) * 2.2;
        y = -8.8 * 2.5;
      } else if (el.category === 'actinide') {
        x = (el.atomicNumber - 89 - 7) * 2.2;
        y = -9.8 * 2.5;
      }

      return new THREE.Vector3(x, y, z);
    } else if (mode === 'cylinder') {
      const radius = 22;
      const phi = (el.atomicNumber / 118) * Math.PI * 6;
      const y = -(el.atomicNumber / 118) * 35 + 17;
      const x = radius * Math.sin(phi);
      const z = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    } else {
      // Sphere mode
      const radius = 22;
      const phi = Math.acos(-1 + (2 * (el.atomicNumber - 1)) / 118);
      const theta = Math.sqrt(118 * Math.PI) * phi;
      const x = radius * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    }
  };

  // Main 3D Scene Initialization
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 550;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x030712); // Deep slate dark slate-950

    // Fog for depth
    scene.fog = new THREE.FogExp2(0x030712, 0.008);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 0, 48);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. Ambient & Directional Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x00e5ff, 1.2);
    dirLight1.position.set(20, 40, 30);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xa855f7, 0.8);
    dirLight2.position.set(-20, -30, -20);
    scene.add(dirLight2);

    // 5. Parent Group for Elements
    const group = new THREE.Group();
    scene.add(group);
    objectsGroupRef.current = group;

    // Background Particle Field
    const particleCount = 400;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 120;
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.4,
      transparent: true,
      opacity: 0.4,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Create 3D Meshes for each Element
    const map = new Map<number, THREE.Mesh>();

    ELEMENTS.forEach((el) => {
      // Texture canvas for element text & styling
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        // Card Background
        const catColor = CATEGORY_COLORS[el.category]?.border.includes('emerald')
          ? '#10b981'
          : CATEGORY_COLORS[el.category]?.border.includes('rose')
          ? '#f43f5e'
          : CATEGORY_COLORS[el.category]?.border.includes('amber')
          ? '#f59e0b'
          : CATEGORY_COLORS[el.category]?.border.includes('purple')
          ? '#a855f7'
          : CATEGORY_COLORS[el.category]?.border.includes('fuchsia')
          ? '#d946ef'
          : '#06b6d4';

        ctx.fillStyle = '#0f172a'; // slate-900
        ctx.fillRect(0, 0, 256, 256);

        // Border
        ctx.strokeStyle = catColor;
        ctx.lineWidth = 12;
        ctx.strokeRect(6, 6, 244, 244);

        // Header Atomic Number
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'bold 28px sans-serif';
        ctx.fillText(`${el.atomicNumber}`, 20, 42);

        // Category Tag
        ctx.fillStyle = catColor;
        ctx.font = 'bold 22px sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(el.symbol, 236, 42);

        // Center Big Symbol
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 88px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(el.symbol, 128, 145);

        // Element Name
        ctx.fillStyle = '#cbd5e1';
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText(el.name, 128, 192);

        // Atomic Mass
        ctx.fillStyle = '#64748b';
        ctx.font = '18px sans-serif';
        ctx.fillText(el.atomicMass, 128, 226);
      }

      const texture = new THREE.CanvasTexture(canvas);
      const geometry = new THREE.BoxGeometry(1.8, 2.1, 0.2);
      const material = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.2,
        metalness: 0.1,
      });

      const mesh = new THREE.Mesh(geometry, material);
      const targetPos = getCoordinates(el, layoutMode);
      mesh.position.copy(targetPos);
      mesh.userData = { elementData: el };

      group.add(mesh);
      map.set(el.atomicNumber, mesh);
    });

    elementMeshesRef.current = map;

    // Orbit/Drag Mouse Interaction Handling
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !objectsGroupRef.current) return;
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;

      objectsGroupRef.current.rotation.y += deltaX * 0.008;
      objectsGroupRef.current.rotation.x += deltaY * 0.008;

      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (!cameraRef.current) return;
      cameraRef.current.position.z += e.deltaY * 0.03;
      cameraRef.current.position.z = Math.max(12, Math.min(cameraRef.current.position.z, 90));
    };

    // Raycaster Click for Element Selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (e: MouseEvent) => {
      if (!container || !cameraRef.current || !objectsGroupRef.current) return;
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObjects(objectsGroupRef.current.children);

      if (intersects.length > 0) {
        const hitMesh = intersects[0].object as THREE.Mesh;
        if (hitMesh.userData?.elementData) {
          setSelectedElement(hitMesh.userData.elementData);
          setIsInspectorOpen(true);
        }
      }
    };

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    dom.addEventListener('wheel', handleWheel, { passive: false });
    dom.addEventListener('click', handleClick);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (objectsGroupRef.current && autoRotate) {
        objectsGroupRef.current.rotation.y += 0.004;
      }

      particles.rotation.y += 0.0005;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 550;
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      dom.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      dom.removeEventListener('wheel', handleWheel);
      dom.removeEventListener('click', handleClick);
      renderer.dispose();
    };
  }, []);

  // Update layout transition when layoutMode changes
  useEffect(() => {
    elementMeshesRef.current.forEach((mesh) => {
      const el: ElementData = mesh.userData.elementData;
      if (!el) return;
      const targetPos = getCoordinates(el, layoutMode);

      // Simple smooth interpolation
      mesh.position.copy(targetPos);
      if (layoutMode === 'cylinder' || layoutMode === 'sphere') {
        mesh.lookAt(0, mesh.position.y, 0);
      } else {
        mesh.rotation.set(0, 0, 0);
      }
    });
  }, [layoutMode]);

  // Highlight filtered meshes
  useEffect(() => {
    const filteredSet = new Set(filteredElements.map((e) => e.atomicNumber));
    elementMeshesRef.current.forEach((mesh, atomicNum) => {
      if (filteredSet.has(atomicNum)) {
        mesh.visible = true;
      } else {
        mesh.visible = false;
      }
    });
  }, [filteredElements]);

  // Secondary 3D Bohr Atom Visualizer in Inspector
  useEffect(() => {
    const container = bohrMountRef.current;
    if (!container || !selectedElement) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 240;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090d16);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Nucleus Cluster
    const nucleusGroup = new THREE.Group();
    const numNucleons = Math.min(selectedElement.atomicNumber, 24);
    for (let i = 0; i < numNucleons; i++) {
      const isProton = i % 2 === 0;
      const geo = new THREE.SphereGeometry(0.35, 16, 16);
      const mat = new THREE.MeshBasicMaterial({
        color: isProton ? 0x06b6d4 : 0xec4899, // Cyan = Proton, Pink = Neutron
      });
      const sphere = new THREE.Mesh(geo, mat);
      sphere.position.set(
        (Math.random() - 0.5) * 1.2,
        (Math.random() - 0.5) * 1.2,
        (Math.random() - 0.5) * 1.2
      );
      nucleusGroup.add(sphere);
    }
    scene.add(nucleusGroup);

    // Electron Shell Orbit Rings
    const atomGroup = new THREE.Group();
    scene.add(atomGroup);

    // Parse configuration shell counts (e.g., 2, 8, 18, 32...)
    const shellCapacities = [2, 8, 18, 32, 32, 18, 8];
    let remainingElectrons = selectedElement.atomicNumber;
    const electronsGroup = new THREE.Group();
    atomGroup.add(electronsGroup);

    const electronMeshes: { mesh: THREE.Mesh; radius: number; speed: number; angle: number }[] = [];

    let shellIndex = 0;
    while (remainingElectrons > 0 && shellIndex < shellCapacities.length) {
      const numInShell = Math.min(remainingElectrons, shellCapacities[shellIndex]);
      const radius = 2.2 + shellIndex * 1.4;

      // Render Orbit Ring line
      const ringGeo = new THREE.RingGeometry(radius - 0.02, radius + 0.02, 64);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2 + (shellIndex * 0.2);
      atomGroup.add(ringMesh);

      // Electrons on this ring
      for (let j = 0; j < numInShell; j++) {
        const eGeo = new THREE.SphereGeometry(0.2, 16, 16);
        const eMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
        const eMesh = new THREE.Mesh(eGeo, eMat);

        const angle = (j / numInShell) * Math.PI * 2;
        const speed = 0.02 + 0.005 * (shellIndex + 1);

        electronsGroup.add(eMesh);
        electronMeshes.push({ mesh: eMesh, radius, speed, angle });
      }

      remainingElectrons -= numInShell;
      shellIndex++;
    }

    let frameId: number;
    const animateBohr = () => {
      frameId = requestAnimationFrame(animateBohr);

      nucleusGroup.rotation.y += 0.01;
      atomGroup.rotation.y += 0.005;

      electronMeshes.forEach((e) => {
        e.angle += e.speed;
        e.mesh.position.x = e.radius * Math.cos(e.angle);
        e.mesh.position.z = e.radius * Math.sin(e.angle);
      });

      renderer.render(scene, camera);
    };

    animateBohr();

    return () => {
      cancelAnimationFrame(frameId);
      renderer.dispose();
    };
  }, [selectedElement]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Controls Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-indigo-950/60 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 p-0.5 shadow-lg shadow-cyan-500/20 flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Atom className="w-7 h-7 text-cyan-400 animate-spin-slow" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-100">3D Interactive Periodic Table</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
                  Three.js 3D WebGL
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Explore 118 chemical elements in 3D space, Bohr atomic orbital models, and organic chemistry roles.
              </p>
            </div>
          </div>

          {/* 3D Layout Mode Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800">
            <button
              onClick={() => setLayoutMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                layoutMode === 'grid'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>3D Grid</span>
            </button>
            <button
              onClick={() => setLayoutMode('cylinder')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                layoutMode === 'cylinder'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Cylinder</span>
            </button>
            <button
              onClick={() => setLayoutMode('sphere')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                layoutMode === 'sphere'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Sphere</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Symbol, Name or No..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Categories (118 Elements)</option>
            <option value="reactive-nonmetal">Reactive Nonmetals (C, H, O, N...)</option>
            <option value="alkali-metal">Alkali Metals (Li, Na, K...)</option>
            <option value="alkaline-earth">Alkaline Earth (Mg, Ca...)</option>
            <option value="transition-metal">Transition Metals (Pd, Cu, Ti, Cr...)</option>
            <option value="post-transition">Post-Transition Metals (Al, Sn...)</option>
            <option value="metalloid">Metalloids (B, Si...)</option>
            <option value="noble-gas">Noble Gases (He, Ar...)</option>
            <option value="lanthanide">Lanthanides (Ce, Sm...)</option>
            <option value="actinide">Actinides (U, Pu...)</option>
          </select>

          {/* Organic Role Toggle */}
          <button
            onClick={() => setOrganicOnly(!organicOnly)}
            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              organicOnly
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Organic Chemistry Key Elements Only</span>
          </button>

          {/* Auto-Rotate Toggle */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              autoRotate
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
            <span>3D Orbit Auto-Rotate</span>
          </button>
        </div>
      </div>

      {/* Main 3D Canvas Area with Inspector Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Three.js WebGL Container */}
        <div className="lg:col-span-2 relative rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden min-h-[550px] flex flex-col">
          <div ref={mountRef} className="w-full flex-1 cursor-grab active:cursor-grabbing" />

          {/* Canvas Instructions Overlay */}
          <div className="absolute top-4 left-4 p-2.5 rounded-xl bg-slate-900/80 backdrop-blur border border-slate-800 text-[11px] text-slate-300 flex items-center gap-2 shadow-lg pointer-events-none">
            <Maximize2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span>Drag mouse to rotate 3D view • Scroll wheel to zoom in/out • Click element to inspect</span>
          </div>

          {/* Legend Strip */}
          <div className="p-3 bg-slate-900/90 border-t border-slate-800/80 flex items-center justify-between text-[11px] overflow-x-auto gap-3">
            <span className="text-slate-400 font-semibold shrink-0">Color Legend:</span>
            <div className="flex items-center gap-2 shrink-0">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-slate-300">Nonmetals</span>
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-cyan-500 ml-2" />
              <span className="text-slate-300">Transition</span>
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 ml-2" />
              <span className="text-slate-300">Alkaline</span>
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-500 ml-2" />
              <span className="text-slate-300">Alkali</span>
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-purple-500 ml-2" />
              <span className="text-slate-300">Noble Gas</span>
            </div>
          </div>
        </div>

        {/* Selected Element Inspector Panel */}
        {selectedElement && isInspectorOpen && (
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5">
            {/* Header / Dismiss */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Element Inspector
                </span>
              </div>
              <button
                onClick={() => setIsInspectorOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Element Overview Header */}
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-bold text-slate-400">
                  Atomic Number {selectedElement.atomicNumber} • Period {selectedElement.period} Group {selectedElement.group}
                </span>
                <h2 className="text-2xl font-black text-slate-100 mt-0.5">{selectedElement.name}</h2>
                <span
                  className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded-md mt-1 ${
                    CATEGORY_COLORS[selectedElement.category]?.bg || 'bg-slate-800'
                  } ${CATEGORY_COLORS[selectedElement.category]?.text || 'text-slate-300'}`}
                >
                  {CATEGORY_COLORS[selectedElement.category]?.name || selectedElement.category}
                </span>
              </div>

              {/* Big Element Symbol Block */}
              <div className="w-20 h-20 rounded-2xl bg-slate-950 border-2 border-cyan-500/50 flex flex-col items-center justify-center shadow-lg shadow-cyan-500/10 shrink-0">
                <span className="text-3xl font-black text-cyan-400">{selectedElement.symbol}</span>
                <span className="text-[10px] text-slate-400 font-mono mt-0.5">{selectedElement.atomicMass}</span>
              </div>
            </div>

            {/* 3D Bohr Atom Model Live Canvas */}
            <div className="rounded-xl bg-slate-950 border border-slate-800 p-3 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <Atom className="w-3.5 h-3.5 animate-spin" />
                  <span>Interactive 3D Bohr Atom Model</span>
                </span>
                <span className="font-mono text-slate-500">{selectedElement.electronConfiguration}</span>
              </div>
              <div ref={bohrMountRef} className="w-full h-[180px] rounded-lg overflow-hidden bg-slate-950" />
            </div>

            {/* Key Properties Table */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Electronegativity</span>
                <span className="font-bold text-slate-200">
                  {selectedElement.electronegativity ? `${selectedElement.electronegativity} (Pauling)` : 'N/A'}
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Natural State at STP</span>
                <span className="font-bold text-slate-200">{selectedElement.state}</span>
              </div>
            </div>

            {/* Organic Chemistry Role Box */}
            {selectedElement.organicRole && (
              <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/40 space-y-1.5 text-xs">
                <span className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Role in Organic Chemistry & Synthesis</span>
                </span>
                <p className="text-slate-300 leading-relaxed text-[11px]">{selectedElement.organicRole}</p>
              </div>
            )}

            {/* General Summary */}
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1 text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-cyan-400" />
                <span>Element Summary</span>
              </span>
              <p className="text-slate-400 leading-relaxed text-[11px]">{selectedElement.summary}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
