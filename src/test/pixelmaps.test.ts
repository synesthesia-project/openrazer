import { getPixelMap } from '../lib/pixelmaps';

describe('Test Pixelmaps', () => {

  // Test that we're able to produce each pixelmap's data from the SVG

  it('Razer Ornata Chroma', async () => {
    await getPixelMap('Razer Ornata Chroma');
  });

});
