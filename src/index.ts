import * as fs from 'fs';
import * as path from 'path';
import {promisify} from 'util';

const KEYBOARDS_PATH = '/sys/bus/hid/drivers/razerkbd/';
const ENCODING = 'utf8';

const matrix_effect_breath = 'matrix_effect_breath';
const matrix_effect_starlight = 'matrix_effect_starlight';
const matrix_effect_custom = 'matrix_effect_custom';
const matrix_effect_none = 'matrix_effect_none';
const matrix_effect_reactive = 'matrix_effect_reactive';

export type RGB = [number, number, number];

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

function filterNonNull<T>(values: (T | null)[]): T[] {
  return values.filter(v => v !== null) as T[];
}

function validateByte(byte: number, name: string) {
  if (byte < 0 || byte > 255)
    throw new Error(`invalid ${name}`);
}

function validateRGB(value: RGB) {
  if (value.length !== 3) throw new Error('invalid RGB Value');
  for (let i = 0; i <= 3; i++) {
    if (value[i] < 0 || value[i] > 255)
      throw new Error('invalid RGB Value');
  }
}

export function getKeyboards(): Promise<Keyboard[]> {
  const keyboards = readdir(KEYBOARDS_PATH).then(devices => Promise.all(
    devices.map(async deviceId => {
      // Get Device Type
      const devicePath = path.join(KEYBOARDS_PATH, deviceId);
      const deviceType = await readFile(path.join(devicePath, 'device_type'), ENCODING).catch(() => null);
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

  /**
   * Return the path of the device folder
   */
  public getDevicePath() {
    return this.devicePath;
  }

  public getDeviceType() {
    return this.deviceType;
  }

  public setMatrixEffectBreath(firstColor?: RGB, secondColor?: RGB) {
    if (firstColor) {
      validateRGB(firstColor);
      if (secondColor) {
        validateRGB(secondColor);
        return this.writeBytes(matrix_effect_breath, [...firstColor, ...secondColor]);
      } else {
        return this.writeBytes(matrix_effect_breath, [...firstColor]);
      }
    } else {
      return this.writeBytes(matrix_effect_breath, [0x1]);
    }
  }

  /**
   * @param speed between 0 and 255, 0 = slow, 255 = fast
   * @param firstColor if set, use this colour in single-color mode
   * @param secondColor if set, use this colour in dual-color mode
   */
  public setMatrixEffectStarlight(speed: number, firstColor?: RGB, secondColor?: RGB) {
    validateByte(speed, 'speed');
    if (firstColor) {
      validateRGB(firstColor);
      if (secondColor) {
        validateRGB(secondColor);
        return this.writeBytes(matrix_effect_starlight, [speed, ...firstColor, ...secondColor]);
      } else {
        return this.writeBytes(matrix_effect_starlight, [speed, ...firstColor]);
      }
    } else {
      return this.writeBytes(matrix_effect_starlight, [speed]);
    }
  }

  /**
   * @param speed between 1 and 3, 1 = short, 3 = long
   * @param color an RGB value
   */
  public setMatrixEffectReactive(speed: number, color: RGB) {
    if (speed < 1 || speed > 3) throw new Error('invalid speed');
    validateRGB(color);
    return this.writeBytes(matrix_effect_reactive, [speed, ...color]);
  }

  /**
   * This command draws the current frame stored in the keyboards memory.
   */
  public writeCustomFrame() {
    return this.writeBytes(matrix_effect_custom, [0x1]);
  }

  public setMatrixEffectNone() {
    return this.writeBytes(matrix_effect_none, [0x1]);
  }

  private writeBytes(file: string, bytes: number[]) {
    return writeFile(path.join(this.devicePath, file), Buffer.from(bytes));
  }
}
