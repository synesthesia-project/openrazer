import * as openrazer from 'openrazer';

(async () => {
  const kbds = await openrazer.getKeyboards();
  console.log(kbds);

})();
