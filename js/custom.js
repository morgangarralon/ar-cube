var square_bas, square_droite, square_gauche, square_haut1, square_haut2, cube_bas, cube_droite, cube_gauche, cube_haut1, cube_haut2;

var renderer, camera, scene;

var textureLoader = new THREE.TextureLoader();

function init() {
    AFRAME.registerComponent('registerevents', {
        init: function () {
            this.marker = this.el;
            var group = document.querySelector('a-box').object3D;

            // MATERIALS 
            var material_color_orange = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
            var material_color_cyan = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
            var material_color_lightOrange = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
            var material_color_red = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });
            var material_color_violet = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide });

            // MESH 
            square_bas = createAndPlaceSquare(material_color_orange, 0, -.5, 1);
            square_bas.visible = false;
            group.add(square_bas);
            square_haut1 = createAndPlaceSquare(material_color_cyan, 0, -.5, -1);
            square_haut1.visible = false;
            group.add(square_haut1);
            square_haut2 = createAndPlaceSquare(material_color_lightOrange, 0, -.5, -2);
            square_haut2.visible = false;
            group.add(square_haut2);
            square_gauche = createAndPlaceSquare(material_color_red, -1, -.5, 0);
            square_gauche.visible = false;
            group.add(square_gauche);
            square_droite = createAndPlaceSquare(material_color_violet, 1, -.5, 0);
            square_droite.visible = false;
            group.add(square_droite);

            cube_bas = createAndPlaceSquare(material_color_orange, 0, 0, 0.5);
            cube_bas.rotateX(Math.PI / 2);
            group.add(cube_bas);
            cube_haut1 = createAndPlaceSquare(material_color_cyan, 0, 0, -.5);
            cube_haut1.rotateX(Math.PI / 2);
            group.add(cube_haut1);
            cube_haut2 = createAndPlaceSquare(material_color_lightOrange, 0, 0.5, 0);
            group.add(cube_haut2);
            cube_gauche = createAndPlaceSquare(material_color_red, -0.5, 0, 0);
            cube_gauche.rotateY(Math.PI / 2);
            group.add(cube_gauche);
            cube_droite = createAndPlaceSquare(material_color_violet, 0.5, 0, 0);
            cube_droite.rotateY(Math.PI / 2);
            group.add(cube_droite);

            this.marker.addEventListener('markerFound', function () {
                var marker = this.object3D;
                var markerId = marker.id;
                console.log('markerFound', markerId);

                var camera = document.querySelector('a-entity').object3D.children[0];
                var video = document.querySelector('video');

                var canvas = document.createElement('canvas');
                canvas.width = video.offsetWidth;
                canvas.height = video.offsetHeight;

                var ctx = canvas.getContext('2d');

                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                var texture = from(canvas.toDataURL());

                texture.get(getSquareCoordinates(camera, square_bas, video), function (url) {
                    loadTexture(cube_bas, url);
                });

                texture.get(getSquareCoordinates(camera, square_droite, video), function (url) {
                    loadTexture(cube_droite, url);
                });

                texture.get(getSquareCoordinates(camera, square_gauche, video), function (url) {
                    loadTexture(cube_gauche, url);
                });

                texture.get(getSquareCoordinates(camera, square_haut1, video), function (url) {
                    loadTexture(cube_haut1, url);
                });

                texture.get(getSquareCoordinates(camera, square_haut2, video), function (url) {
                    loadTexture(cube_haut2, url);
                });

            });

            this.marker.addEventListener('markerLost', function () {
                var marker = this.object3D;
                var markerId = marker.id;
                console.log('markerLost', markerId);
            });
        }
    });

    AFRAME.registerComponent('setupscene', {
        init: function () {
            scene = this.el.object3D;
            renderer = this.el.renderer;
            camera = this.el.camera;
        }
    });

}


function placeSquare(square_mesh, relativeX, relativeY, relativeZ) {
    if (relativeX != undefined) {
        square_mesh.position.x = square_mesh.position.x + relativeX;
    }

    if (relativeY != undefined) {
        square_mesh.position.y = square_mesh.position.y + relativeY;
    }

    if (relativeZ != undefined) {
        square_mesh.position.z = square_mesh.position.z + relativeZ;
    }
    return square_mesh;
}

function createAndPlaceSquare(material, relativeX, relativeY, relativeZ) {
    var geometry = new THREE.PlaneGeometry(1, 1);
    relativeX = relativeX || undefined;
    relativeY = relativeY || undefined;
    relativeZ = relativeZ || undefined;


    var square_mesh = new THREE.Mesh(geometry, material);
    square_mesh.rotation.x = Math.PI / 2;
    return placeSquare(square_mesh, relativeX, relativeY, relativeZ);
}

function getSquareCoordinates(camera, square, video) {

    square.updateMatrixWorld();

    var points = [];
    for (let i = 0; i < square.geometry.vertices.length; i++) {
        var vector = square.geometry.vertices[i].clone();
        var projectedPosition = vector.applyMatrix4(square.matrixWorld).project(camera);

        projectedPosition.x = Math.round((vector.x + 1) / 2 * video.offsetWidth);
        projectedPosition.y = Math.round(-(vector.y - 1) / 2 * video.offsetHeight);

        points.push(projectedPosition);
    }

    return points;
}

function getSquareSize(square) {
    square.geometry.computeBoundingBox()

    var size = square.geometry.boundingBox.getSize();

    return {
        width: size.x,
        heigth: size.y
    }
}

function loadTexture(element, texture) {
    element.material.needsUpdate = true;

    textureLoader.load(texture, function (texture) {
        element.color = undefined;
        element.material.map = texture;
    })
}

init();
