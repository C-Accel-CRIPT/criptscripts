/**
 * Tiny CRIPT API Client to perform basic tasks on Projects
 * - create a Project (POST)
 * - update a Project (PATCH)
 *
 * The goal is to allow user to upload a large JSON by...
 * - creating a childless project
 * - uploading the project chunk by chunk (API has a node max count limit)
 */
import { IProject } from "@cript";

type Options = {
  api_base_url: string,
  api_token: string,
}

export class CriptApiClient {
  private _options: Options;
  constructor(options: Options) {
    this._options = structuredClone(options);
  }
  async save_project(project: IProject, method: 'POST' | 'PATCH'): Promise<any> {
    throw new Error('Not implemented yet');
  }
}