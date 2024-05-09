import { LinearFilter, TextureLoader } from "three";

export default class CrossyTextureLoader {
  constructor() {
    this.textureLoader = new TextureLoader();
  }

  loadTexture(
    textureImage,
    generateMipmaps = false,
    magFilter = LinearFilter,
    minFilter = LinearFilter,
    premultiplyAlpha = true
  ) {
    const texture = this.textureLoader.load(textureImage);
    texture.generateMipmaps = generateMipmaps;
    texture.magFilter = magFilter;
    texture.minFilter = minFilter;
    texture.premultiplyAlpha = premultiplyAlpha;
    return texture;
  }
}
