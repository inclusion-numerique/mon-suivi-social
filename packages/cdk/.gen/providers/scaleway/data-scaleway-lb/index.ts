// https://www.terraform.io/docs/providers/scaleway/d/lb
// generated from terraform resource schema

import { Construct } from 'constructs';
import * as cdktf from 'cdktf';

// Configuration

export interface DataScalewayLbConfig extends cdktf.TerraformMetaArguments {
  /**
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/d/lb#id DataScalewayLb#id}
  *
  * Please be aware that the id field is automatically added to all resources in Terraform providers using a Terraform provider SDK version below 2.
  * If you experience problems setting this value it might not be settable. Please take a look at the provider documentation to ensure it should be settable.
  */
  readonly id?: string;
  /**
  * The ID of the load-balancer
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/d/lb#lb_id DataScalewayLb#lb_id}
  */
  readonly lbId?: string;
  /**
  * Name of the lb
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/d/lb#name DataScalewayLb#name}
  */
  readonly name?: string;
  /**
  * Release the IPs related to this load-balancer
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/d/lb#release_ip DataScalewayLb#release_ip}
  */
  readonly releaseIp?: boolean | cdktf.IResolvable;
  /**
  * The zone you want to attach the resource to
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/d/lb#zone DataScalewayLb#zone}
  */
  readonly zone?: string;
}
export interface DataScalewayLbPrivateNetwork {
}

export function dataScalewayLbPrivateNetworkToTerraform(struct?: DataScalewayLbPrivateNetwork): any {
  if (!cdktf.canInspect(struct) || cdktf.Tokenization.isResolvable(struct)) { return struct; }
  if (cdktf.isComplexElement(struct)) {
    throw new Error("A complex element was used as configuration, this is not supported: https://cdk.tf/complex-object-as-configuration");
  }
  return {
  }
}

export class DataScalewayLbPrivateNetworkOutputReference extends cdktf.ComplexObject {
  private isEmptyObject = false;

  /**
  * @param terraformResource The parent resource
  * @param terraformAttribute The attribute on the parent resource this class is referencing
  * @param complexObjectIndex the index of this item in the list
  * @param complexObjectIsFromSet whether the list is wrapping a set (will add tolist() to be able to access an item via an index)
  */
  public constructor(terraformResource: cdktf.IInterpolatingParent, terraformAttribute: string, complexObjectIndex: number, complexObjectIsFromSet: boolean) {
    super(terraformResource, terraformAttribute, complexObjectIsFromSet, complexObjectIndex);
  }

  public get internalValue(): DataScalewayLbPrivateNetwork | undefined {
    let hasAnyValues = this.isEmptyObject;
    const internalValueResult: any = {};
    return hasAnyValues ? internalValueResult : undefined;
  }

  public set internalValue(value: DataScalewayLbPrivateNetwork | undefined) {
    if (value === undefined) {
      this.isEmptyObject = false;
    }
    else {
      this.isEmptyObject = Object.keys(value).length === 0;
    }
  }

  // dhcp_config - computed: true, optional: false, required: false
  public get dhcpConfig() {
    return this.getBooleanAttribute('dhcp_config');
  }

  // private_network_id - computed: true, optional: false, required: false
  public get privateNetworkId() {
    return this.getStringAttribute('private_network_id');
  }

  // static_config - computed: true, optional: false, required: false
  public get staticConfig() {
    return this.getListAttribute('static_config');
  }

  // status - computed: true, optional: false, required: false
  public get status() {
    return this.getStringAttribute('status');
  }

  // zone - computed: true, optional: false, required: false
  public get zone() {
    return this.getStringAttribute('zone');
  }
}

export class DataScalewayLbPrivateNetworkList extends cdktf.ComplexList {

  /**
  * @param terraformResource The parent resource
  * @param terraformAttribute The attribute on the parent resource this class is referencing
  * @param wrapsSet whether the list is wrapping a set (will add tolist() to be able to access an item via an index)
  */
  constructor(protected terraformResource: cdktf.IInterpolatingParent, protected terraformAttribute: string, protected wrapsSet: boolean) {
    super(terraformResource, terraformAttribute, wrapsSet)
  }

  /**
  * @param index the index of the item to return
  */
  public get(index: number): DataScalewayLbPrivateNetworkOutputReference {
    return new DataScalewayLbPrivateNetworkOutputReference(this.terraformResource, this.terraformAttribute, index, this.wrapsSet);
  }
}

/**
* Represents a {@link https://www.terraform.io/docs/providers/scaleway/d/lb scaleway_lb}
*/
export class DataScalewayLb extends cdktf.TerraformDataSource {

  // =================
  // STATIC PROPERTIES
  // =================
  public static readonly tfResourceType = "scaleway_lb";

  // ===========
  // INITIALIZER
  // ===========

  /**
  * Create a new {@link https://www.terraform.io/docs/providers/scaleway/d/lb scaleway_lb} Data Source
  *
  * @param scope The scope in which to define this construct
  * @param id The scoped construct ID. Must be unique amongst siblings in the same scope
  * @param options DataScalewayLbConfig = {}
  */
  public constructor(scope: Construct, id: string, config: DataScalewayLbConfig = {}) {
    super(scope, id, {
      terraformResourceType: 'scaleway_lb',
      terraformGeneratorMetadata: {
        providerName: 'scaleway',
        providerVersion: '2.8.0',
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
    this._id = config.id;
    this._lbId = config.lbId;
    this._name = config.name;
    this._releaseIp = config.releaseIp;
    this._zone = config.zone;
  }

  // ==========
  // ATTRIBUTES
  // ==========

  // description - computed: true, optional: false, required: false
  public get description() {
    return this.getStringAttribute('description');
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

  // ip_address - computed: true, optional: false, required: false
  public get ipAddress() {
    return this.getStringAttribute('ip_address');
  }

  // ip_id - computed: true, optional: false, required: false
  public get ipId() {
    return this.getStringAttribute('ip_id');
  }

  // lb_id - computed: false, optional: true, required: false
  private _lbId?: string; 
  public get lbId() {
    return this.getStringAttribute('lb_id');
  }
  public set lbId(value: string) {
    this._lbId = value;
  }
  public resetLbId() {
    this._lbId = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get lbIdInput() {
    return this._lbId;
  }

  // name - computed: false, optional: true, required: false
  private _name?: string; 
  public get name() {
    return this.getStringAttribute('name');
  }
  public set name(value: string) {
    this._name = value;
  }
  public resetName() {
    this._name = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get nameInput() {
    return this._name;
  }

  // organization_id - computed: true, optional: false, required: false
  public get organizationId() {
    return this.getStringAttribute('organization_id');
  }

  // private_network - computed: true, optional: false, required: false
  private _privateNetwork = new DataScalewayLbPrivateNetworkList(this, "private_network", false);
  public get privateNetwork() {
    return this._privateNetwork;
  }

  // project_id - computed: true, optional: false, required: false
  public get projectId() {
    return this.getStringAttribute('project_id');
  }

  // region - computed: true, optional: false, required: false
  public get region() {
    return this.getStringAttribute('region');
  }

  // release_ip - computed: false, optional: true, required: false
  private _releaseIp?: boolean | cdktf.IResolvable; 
  public get releaseIp() {
    return this.getBooleanAttribute('release_ip');
  }
  public set releaseIp(value: boolean | cdktf.IResolvable) {
    this._releaseIp = value;
  }
  public resetReleaseIp() {
    this._releaseIp = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get releaseIpInput() {
    return this._releaseIp;
  }

  // ssl_compatibility_level - computed: true, optional: false, required: false
  public get sslCompatibilityLevel() {
    return this.getStringAttribute('ssl_compatibility_level');
  }

  // tags - computed: true, optional: false, required: false
  public get tags() {
    return this.getListAttribute('tags');
  }

  // type - computed: true, optional: false, required: false
  public get type() {
    return this.getStringAttribute('type');
  }

  // zone - computed: false, optional: true, required: false
  private _zone?: string; 
  public get zone() {
    return this.getStringAttribute('zone');
  }
  public set zone(value: string) {
    this._zone = value;
  }
  public resetZone() {
    this._zone = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get zoneInput() {
    return this._zone;
  }

  // =========
  // SYNTHESIS
  // =========

  protected synthesizeAttributes(): { [name: string]: any } {
    return {
      id: cdktf.stringToTerraform(this._id),
      lb_id: cdktf.stringToTerraform(this._lbId),
      name: cdktf.stringToTerraform(this._name),
      release_ip: cdktf.booleanToTerraform(this._releaseIp),
      zone: cdktf.stringToTerraform(this._zone),
    };
  }
}
