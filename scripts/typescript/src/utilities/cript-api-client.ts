import { IMaterial, IProject, IReference, Slug } from "@cript";

export type CriptApiClientConstructorOptions = {
  API_BASE_URL: string,
  API_TOKEN: string,
}

export class CriptApiClient {
  private _options: CriptApiClientConstructorOptions;
  constructor(options: CriptApiClientConstructorOptions) {
    this._options = structuredClone(options);
    console.log('CriptApiClient is ready')
  }
  async post(type: Slug, payload: Partial<any> ): Promise<any> {
    const body = {...payload, node: [type]}; // Ensure "node" field is present
    return await this.fetch_api( `${type.toLowerCase()}/`, { method: 'POST' }, body );
  }

  async patch(type: Slug, payload: Partial<any>, uuid?: string ): Promise<any> {
    const body = {...payload, node: [type]}; // Ensure "node" field is present
    return await this.fetch_api( `${type.toLowerCase()}/${uuid}/`, { method: 'PATCH' }, body );
  }

  private async fetch_api(
    url_sub: string,
    options?: RequestInit,
    body?: Object,
  ) {
    const url = `${this._options.API_BASE_URL}/${url_sub}`;

    const requestOptions: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this._options.API_TOKEN}`,
        ...options?.headers,
      },
      body: JSON.stringify(body),
    };

    const response = await fetch(url, requestOptions)
    const json     = await response.json();

    if (!response.ok) {
      switch ( json.code ) {
        case 409:
          console.warn(json.error);
          break;
        default:
          throw new Error('Error while fetching API', { cause: json });
      }
    }
    return json;
  };

  async post_shared_references<T extends IReference>(references: T[]) {

    if( references.length === 0 ) return;
    let i = 1;
    for (const reference of references ) {
      console.log(`Upload reference ${i}/${references.length} ...`)
      try {
        await this.post('Reference', reference);
      } catch( e: any ) {
        console.error(`Error while posting reference`, e.cause, e.stack)
      }
      i++;
    }
  }
}

