export interface NFNodeResponse {
  data: {
    id: number;
    attributes: NFNodeAttributes;
  }[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface NFNodeAttributes {
  name: string;
  wayru_device_id?: string;
  solana_asset_id?: string;
  mac: string;
  serial?: string;
  model: string;
  longitude?: number;
  latitude?: number;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  wallet?: string;
  nfnode_type?: "wayru" | "byod" | "don";
  nas_id?: string;
}

export interface NFNode extends NFNodeAttributes {
  id: number;
}
