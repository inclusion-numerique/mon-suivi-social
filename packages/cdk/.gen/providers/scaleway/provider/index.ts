// https://www.terraform.io/docs/providers/scaleway
// generated from terraform resource schema

import { Construct } from 'constructs';
import * as cdktf from 'cdktf';

// Configuration

export interface ScalewayProviderConfig {
  /**
  * The Scaleway access key.
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway#access_key ScalewayProvider#access_key}
  */
  readonly accessKey?: string;
  /**
  * The Scaleway API URL to use.
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway#api_url ScalewayProvider#api_url}
  */
  readonly apiUrl?: string;
  /**
  * The Scaleway organization ID.
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway#organization_id ScalewayProvider#organization_id}
  */
  readonly organizationId?: string;
  /**
  * The Scaleway profile to use.
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway#profile ScalewayProvider#profile}
  */
  readonly profile?: string;
  /**
  * The Scaleway project ID.
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway#project_id ScalewayProvider#project_id}
  */
  readonly projectId?: string;
  /**
  * The region you want to attach the resource to
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway#region ScalewayProvider#region}
  */
  readonly region?: string;
  /**
  * The Scaleway secret Key.
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway#secret_key ScalewayProvider#secret_key}
  */
  readonly secretKey?: string;
  /**
  * The zone you want to attach the resource to
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway#zone ScalewayProvider#zone}
  */
  readonly zone?: string;
  /**
  * Alias name
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway#alias ScalewayProvider#alias}
  */
  readonly alias?: string;
}

/**
* Represents a {@link https://www.terraform.io/docs/providers/scaleway scaleway}
*/
export class ScalewayProvider extends cdktf.TerraformProvider {

  // =================
  // STATIC PROPERTIES
  // =================
  public static readonly tfResourceType = "scaleway";

  // ===========
  // INITIALIZER
  // ===========

  /**
  * Create a new {@link https://www.terraform.io/docs/providers/scaleway scaleway} Resource
  *
  * @param scope The scope in which to define this construct
  * @param id The scoped construct ID. Must be unique amongst siblings in the same scope
  * @param options ScalewayProviderConfig = {}
  */
  public constructor(scope: Construct, id: string, config: ScalewayProviderConfig = {}) {
    super(scope, id, {
      terraformResourceType: 'scaleway',
      terraformGeneratorMetadata: {
        providerName: 'scaleway',
        providerVersion: '2.9.1',
        providerVersionConstraint: '>= 2.8.0'
      },
      terraformProviderSource: 'scaleway/scaleway'
    });
    this._accessKey = config.accessKey;
    this._apiUrl = config.apiUrl;
    this._organizationId = config.organizationId;
    this._profile = config.profile;
    this._projectId = config.projectId;
    this._region = config.region;
    this._secretKey = config.secretKey;
    this._zone = config.zone;
    this._alias = config.alias;
  }

  // ==========
  // ATTRIBUTES
  // ==========

  // access_key - computed: false, optional: true, required: false
  private _accessKey?: string; 
  public get accessKey() {
    return this._accessKey;
  }
  public set accessKey(value: string | undefined) {
    this._accessKey = value;
  }
  public resetAccessKey() {
    this._accessKey = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get accessKeyInput() {
    return this._accessKey;
  }

  // api_url - computed: false, optional: true, required: false
  private _apiUrl?: string; 
  public get apiUrl() {
    return this._apiUrl;
  }
  public set apiUrl(value: string | undefined) {
    this._apiUrl = value;
  }
  public resetApiUrl() {
    this._apiUrl = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get apiUrlInput() {
    return this._apiUrl;
  }

  // organization_id - computed: false, optional: true, required: false
  private _organizationId?: string; 
  public get organizationId() {
    return this._organizationId;
  }
  public set organizationId(value: string | undefined) {
    this._organizationId = value;
  }
  public resetOrganizationId() {
    this._organizationId = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get organizationIdInput() {
    return this._organizationId;
  }

  // profile - computed: false, optional: true, required: false
  private _profile?: string; 
  public get profile() {
    return this._profile;
  }
  public set profile(value: string | undefined) {
    this._profile = value;
  }
  public resetProfile() {
    this._profile = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get profileInput() {
    return this._profile;
  }

  // project_id - computed: false, optional: true, required: false
  private _projectId?: string; 
  public get projectId() {
    return this._projectId;
  }
  public set projectId(value: string | undefined) {
    this._projectId = value;
  }
  public resetProjectId() {
    this._projectId = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get projectIdInput() {
    return this._projectId;
  }

  // region - computed: true, optional: true, required: false
  private _region?: string; 
  public get region() {
    return this._region;
  }
  public set region(value: string | undefined) {
    this._region = value;
  }
  public resetRegion() {
    this._region = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get regionInput() {
    return this._region;
  }

  // secret_key - computed: false, optional: true, required: false
  private _secretKey?: string; 
  public get secretKey() {
    return this._secretKey;
  }
  public set secretKey(value: string | undefined) {
    this._secretKey = value;
  }
  public resetSecretKey() {
    this._secretKey = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get secretKeyInput() {
    return this._secretKey;
  }

  // zone - computed: true, optional: true, required: false
  private _zone?: string; 
  public get zone() {
    return this._zone;
  }
  public set zone(value: string | undefined) {
    this._zone = value;
  }
  public resetZone() {
    this._zone = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get zoneInput() {
    return this._zone;
  }

  // alias - computed: false, optional: true, required: false
  private _alias?: string; 
  public get alias() {
    return this._alias;
  }
  public set alias(value: string | undefined) {
    this._alias = value;
  }
  public resetAlias() {
    this._alias = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get aliasInput() {
    return this._alias;
  }

  // =========
  // SYNTHESIS
  // =========

  protected synthesizeAttributes(): { [name: string]: any } {
    return {
      access_key: cdktf.stringToTerraform(this._accessKey),
      api_url: cdktf.stringToTerraform(this._apiUrl),
      organization_id: cdktf.stringToTerraform(this._organizationId),
      profile: cdktf.stringToTerraform(this._profile),
      project_id: cdktf.stringToTerraform(this._projectId),
      region: cdktf.stringToTerraform(this._region),
      secret_key: cdktf.stringToTerraform(this._secretKey),
      zone: cdktf.stringToTerraform(this._zone),
      alias: cdktf.stringToTerraform(this._alias),
    };
  }
}
