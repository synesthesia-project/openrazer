import * as fs from 'fs';
import * as path from 'path';
import {promisify} from 'util';

const KEYBOARDS_PATH = '/sys/bus/hid/drivers/razerkbd/';
const ENCODING = 'utf8';

const DEVICE_TYPE = 'device_type';

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);

function filterNonNull<T>(values: (T | null)[]): T[] {
  return values.filter(v => v !== null) as T[];
}

export function getKeyboards(): Promise<Keyboard[]> {
  const keyboards = readdir(KEYBOARDS_PATH).then(devices => Promise.all(
    devices.map(async deviceId => {
      // Get Device Type
      const devicePath = path.join(KEYBOARDS_PATH, deviceId);
      const deviceType = await readFile(path.join(devicePath, DEVICE_TYPE), ENCODING).catch(() => null);
      return deviceType ? new Keyboard(devicePath, deviceType.trim()) : null;
    })
  ));
  return keyboards.then(filterNonNull);
}

export class Keyboard {

  /**
   * The path to the device
   */
  private readonly devicePath: string;
  private readonly deviceType: string;

  public constructor(devicePath: string, deviceType: string) {
    this.devicePath = devicePath;
    this.deviceType = deviceType;
  }
}
