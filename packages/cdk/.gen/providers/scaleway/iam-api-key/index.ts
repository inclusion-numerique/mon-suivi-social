// https://www.terraform.io/docs/providers/scaleway/r/iam_api_key
// generated from terraform resource schema

import { Construct } from 'constructs';
import * as cdktf from 'cdktf';

// Configuration

export interface IamApiKeyConfig extends cdktf.TerraformMetaArguments {
  /**
  * ID of the application attached to the api key
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/r/iam_api_key#application_id IamApiKey#application_id}
  */
  readonly applicationId?: string;
  /**
  * The project_id you want to attach the resource to
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/r/iam_api_key#default_project_id IamApiKey#default_project_id}
  */
  readonly defaultProjectId?: string;
  /**
  * The description of the iam api key
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/r/iam_api_key#description IamApiKey#description}
  */
  readonly description?: string;
  /**
  * The date and time of the expiration of the iam api key. Cannot be changed afterwards
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/r/iam_api_key#expires_at IamApiKey#expires_at}
  */
  readonly expiresAt?: string;
  /**
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/r/iam_api_key#id IamApiKey#id}
  *
  * Please be aware that the id field is automatically added to all resources in Terraform providers using a Terraform provider SDK version below 2.
  * If you experience problems setting this value it might not be settable. Please take a look at the provider documentation to ensure it should be settable.
  */
  readonly id?: string;
  /**
  * ID of the user attached to the api key
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/r/iam_api_key#user_id IamApiKey#user_id}
  */
  readonly userId?: string;
}

/**
* Represents a {@link https://www.terraform.io/docs/providers/scaleway/r/iam_api_key scaleway_iam_api_key}
*/
export class IamApiKey extends cdktf.TerraformResource {

  // =================
  // STATIC PROPERTIES
  // =================
  public static readonly tfResourceType = "scaleway_iam_api_key";

  // ===========
  // INITIALIZER
  // ===========

  /**
  * Create a new {@link https://www.terraform.io/docs/providers/scaleway/r/iam_api_key scaleway_iam_api_key} Resource
  *
  * @param scope The scope in which to define this construct
  * @param id The scoped construct ID. Must be unique amongst siblings in the same scope
  * @param options IamApiKeyConfig = {}
  */
  public constructor(scope: Construct, id: string, config: IamApiKeyConfig = {}) {
    super(scope, id, {
      terraformResourceType: 'scaleway_iam_api_key',
      terraformGeneratorMetadata: {
        providerName: 'scaleway',
        providerVersion: '2.9.1',
        providerVersionConstraint: '>= 2.8.0'
      },
      provider: config.provider,
      dependsOn: config.dependsOn,
      count: config.count,
      lifecycle: config.lifecycle,
      provisioners: config.provisioners,
      connection: config.connection,
      forEach: config.forEach
    });
    this._applicationId = config.applicationId;
    this._defaultProjectId = config.defaultProjectId;
    this._description = config.description;
    this._expiresAt = config.expiresAt;
    this._id = config.id;
    this._userId = config.userId;
  }

  // ==========
  // ATTRIBUTES
  // ==========

  // access_key - computed: true, optional: false, required: false
  public get accessKey() {
    return this.getStringAttribute('access_key');
  }

  // application_id - computed: false, optional: true, required: false
  private _applicationId?: string; 
  public get applicationId() {
    return this.getStringAttribute('application_id');
  }
  public set applicationId(value: string) {
    this._applicationId = value;
  }
  public resetApplicationId() {
    this._applicationId = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get applicationIdInput() {
    return this._applicationId;
  }

  // created_at - computed: true, optional: false, required: false
  public get createdAt() {
    return this.getStringAttribute('created_at');
  }

  // creation_ip - computed: true, optional: false, required: false
  public get creationIp() {
    return this.getStringAttribute('creation_ip');
  }

  // default_project_id - computed: true, optional: true, required: false
  private _defaultProjectId?: string; 
  public get defaultProjectId() {
    return this.getStringAttribute('default_project_id');
  }
  public set defaultProjectId(value: string) {
    this._defaultProjectId = value;
  }
  public resetDefaultProjectId() {
    this._defaultProjectId = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get defaultProjectIdInput() {
    return this._defaultProjectId;
  }

  // description - computed: false, optional: true, required: false
  private _description?: string; 
  public get description() {
    return this.getStringAttribute('description');
  }
  public set description(value: string) {
    this._description = value;
  }
  public resetDescription() {
    this._description = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get descriptionInput() {
    return this._description;
  }

  // editable - computed: true, optional: false, required: false
  public get editable() {
    return this.getBooleanAttribute('editable');
  }

  // expires_at - computed: false, optional: true, required: false
  private _expiresAt?: string; 
  public get expiresAt() {
    return this.getStringAttribute('expires_at');
  }
  public set expiresAt(value: string) {
    this._expiresAt = value;
  }
  public resetExpiresAt() {
    this._expiresAt = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get expiresAtInput() {
    return this._expiresAt;
  }

  // id - computed: true, optional: true, required: false
  private _id?: string; 
  public get id() {
    return this.getStringAttribute('id');
  }
  public set id(value: string) {
    this._id = value;
  }
  public resetId() {
    this._id = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get idInput() {
    return this._id;
  }

  // secret_key - computed: true, optional: false, required: false
  public get secretKey() {
    return this.getStringAttribute('secret_key');
  }

  // updated_at - computed: true, optional: false, required: false
  public get updatedAt() {
    return this.getStringAttribute('updated_at');
  }

  // user_id - computed: false, optional: true, required: false
  private _userId?: string; 
  public get userId() {
    return this.getStringAttribute('user_id');
  }
  public set userId(value: string) {
    this._userId = value;
  }
  public resetUserId() {
    this._userId = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get userIdInput() {
    return this._userId;
  }

  // =========
  // SYNTHESIS
  // =========

  protected synthesizeAttributes(): { [name: string]: any } {
    return {
      application_id: cdktf.stringToTerraform(this._applicationId),
      default_project_id: cdktf.stringToTerraform(this._defaultProjectId),
      description: cdktf.stringToTerraform(this._description),
      expires_at: cdktf.stringToTerraform(this._expiresAt),
      id: cdktf.stringToTerraform(this._id),
      user_id: cdktf.stringToTerraform(this._userId),
    };
  }
}
