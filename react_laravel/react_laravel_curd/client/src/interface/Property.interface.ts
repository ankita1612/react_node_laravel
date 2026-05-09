export interface  IProperty {
  property_name: string;
  property_detail: string;
  property_type: string;
  property_size?: string;
  owner_id: string;
  amenities: string[];
  property_address: string;
  brochure?: File;
  photos?: FileList;
}