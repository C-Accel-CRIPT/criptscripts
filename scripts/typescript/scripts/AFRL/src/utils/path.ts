import { resolve } from 'src/utils/path'

const package_directory_path = resolve();
export const output_dir_path = resolve(package_directory_path, './out/');