import * as openrazer from 'openrazer';

const wait = (millis: number) => new Promise(resolve => setTimeout(resolve, millis));

(async () => {
  const kbds = await openrazer.getKeyboards();

  if (kbds.length === 0) return;
  const kbd = kbds[0];

  console.log('Setting to random breathing effect');
  kbd.setMatrixEffectBreath();

  await wait(5000);

  console.log('Setting to single color breathing effect');
  kbd.setMatrixEffectBreath([255, 0, 0]);

  await wait(5000);

  console.log('Setting to dual color breathing effect');
  kbd.setMatrixEffectBreath([255, 255, 255], [0, 0, 255]);

  await wait(5000);

})();
