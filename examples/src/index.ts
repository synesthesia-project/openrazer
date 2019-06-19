import * as openrazer from 'openrazer';

const wait = (millis: number) => new Promise(resolve => setTimeout(resolve, millis));

(async () => {
  const kbds = await openrazer.getKeyboards();

  if (kbds.length === 0) return;
  const kbd = kbds[0];

  // console.log('Setting to random breathing effect');
  // kbd.setMatrixEffectBreath();

  // await wait(5000);

  // console.log('Setting to single color breathing effect');
  // kbd.setMatrixEffectBreath([255, 0, 0]);

  // await wait(5000);

  // console.log('Setting to dual color breathing effect');
  // kbd.setMatrixEffectBreath([255, 255, 255], [0, 0, 255]);

  // await wait(5000);

  // console.log('Setting starlight effect, speed 0');
  // kbd.setStarlightEffect(0);

  // await wait(5000);

  // console.log('Setting starlight effect, speed 100');
  // kbd.setStarlightEffect(100);

  // await wait(5000);

  // console.log('Setting starlight effect, speed 255');
  // kbd.setStarlightEffect(255);

  await wait(5000);

  console.log('Setting starlight effect, in red, speed 50');
  kbd.setStarlightEffect(50, [255, 0, 0]);

  await wait(5000);

  console.log('Setting starlight effect, dual mode, speed 50');
  kbd.setStarlightEffect(50, [0, 200, 255], [150, 0, 255]);

})();
