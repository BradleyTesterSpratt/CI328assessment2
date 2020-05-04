class Background {
  constructor(scene, noOfDoodads) {
    this.backdropItems = {
      floors: [ 'sand', 'grass' ],
      pillars: [ 
          { name: 'metalPosts', depth: 0 },
          { name: 'treePosts', depth: 10 }
      ],
      doodads: [ 'doodad1', 'doodad2', 'doodad3', 'doodad4', 'doodad5', 'doodad6',
                 'doodad7', 'doodad8', 'doodad9', 'doodad10', 'doodad11' ]
    };
    this.buildBackdrop(scene, noOfDoodads);
  }

  buildBackdrop(scene, noOfDoodads) {
    let randNum = parseInt(Math.random() * this.backdropItems.floors.length);
    scene.add.image(400, 400, this.backdropItems.floors[randNum]);
    randNum = parseInt(Math.random() * this.backdropItems.pillars.length);
    let posts = scene.add.image(400, 400, this.backdropItems.pillars[randNum].name);
    posts.setDepth(posts.depth + this.backdropItems.pillars[randNum].depth);
    for (let i =0; i < noOfDoodads; i++) {
        randNum = parseInt(Math.random() * this.backdropItems.doodads.length);
        scene.add.image(400, 400, this.backdropItems.doodads[randNum]);
    }
  }
}