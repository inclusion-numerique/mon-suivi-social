// https://www.terraform.io/docs/providers/scaleway/r/instance_server
// generated from terraform resource schema

import { Construct } from 'constructs';
import * as cdktf from 'cdktf';

// Configuration

export interface InstanceServerConfig extends cdktf.TerraformMetaArguments {
  /**
  * The additional volumes attached to the server
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/r/instance_server#additional_volume_ids InstanceServer#additional_volume_ids}
  */
  readonly additionalVolumeIds?: string[];
  /**
  * The boot type of the server
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/r/instance_server#boot_type InstanceServer#boot_type}
  */
  readonly bootType?: string;
  /**
  * ID of the target bootscript (set boot_type to bootscript)
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/r/instance_server#bootscript_id InstanceServer#bootscript_id}
  */
  readonly bootscriptId?: string;
  /**
  * The cloud init script associated with this server
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/r/instance_server#cloud_init InstanceServer#cloud_init}
  */
  readonly cloudInit?: string;
  /**
  * Enable dynamic IP on the server
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/r/instance_server#enable_dynamic_ip InstanceServer#enable_dynamic_ip}
  */
  readonly enableDynamicIp?: boolean | cdktf.IResolvable;
  /**
  * Determines if IPv6 is enabled for the server
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/r/instance_server#enable_ipv6 InstanceServer#enable_ipv6}
  */
  readonly enableIpv6?: boolean | cdktf.IResolvable;
  /**
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/r/instance_server#id InstanceServer#id}
  *
  * Please be aware that the id field is automatically added to all resources in Terraform providers using a Terraform provider SDK version below 2.
  * If you experience problems setting this value it might not be settable. Please take a look at the provider documentation to ensure it should be settable.
  */
  readonly id?: string;
  /**
  * The UUID or the label of the base image used by the server
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/r/instance_server#image InstanceServer#image}
  */
  readonly image?: string;
  /**
  * The ID of the reserved IP for the server
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/r/instance_server#ip_id InstanceServer#ip_id}
  */
  readonly ipId?: string;
  /**
  * The name of the server
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/r/instance_server#name InstanceServer#name}
  */
  readonly name?: string;
  /**
  * The placement group the server is attached to
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/r/instance_server#placement_group_id InstanceServer#placement_group_id}
  */
  readonly placementGroupId?: string;
  /**
  * The project_id you want to attach the resource to
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/r/instance_server#project_id InstanceServer#project_id}
  */
  readonly projectId?: string;
  /**
  * The security group the server is attached to
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/r/instance_server#security_group_id InstanceServer#security_group_id}
  */
  readonly securityGroupId?: string;
  /**
  * The state of the server should be: started, stopped, standby
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/r/instance_server#state InstanceServer#state}
  */
  readonly state?: string;
  /**
  * The tags associated with the server
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/r/instance_server#tags InstanceServer#tags}
  */
  readonly tags?: string[];
  /**
  * The instance type of the server
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/r/instance_server#type InstanceServer#type}
  */
  readonly type: string;
  /**
  * The user data associated with the server
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/r/instance_server#user_data InstanceServer#user_data}
  */
  readonly userData?: { [key: string]: string };
  /**
  * The zone you want to attach the resource to
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/r/instance_server#zone InstanceServer#zone}
  */
  readonly zone?: string;
  /**
  * private_network block
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/r/instance_server#private_network InstanceServer#private_network}
  */
  readonly privateNetwork?: InstanceServerPrivateNetwork[] | cdktf.IResolvable;
  /**
  * root_volume block
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/r/instance_server#root_volume InstanceServer#root_volume}
  */
  readonly rootVolume?: InstanceServerRootVolume;
  /**
  * timeouts block
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/r/instance_server#timeouts InstanceServer#timeouts}
  */
  readonly timeouts?: InstanceServerTimeouts;
}
export interface InstanceServerPrivateNetwork {
  /**
  * The Private Network ID
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/r/instance_server#pn_id InstanceServer#pn_id}
  */
  readonly pnId: string;
  /**
  * The zone you want to attach the resource to
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/r/instance_server#zone InstanceServer#zone}
  */
  readonly zone?: string;
}

export function instanceServerPrivateNetworkToTerraform(struct?: InstanceServerPrivateNetwork | cdktf.IResolvable): any {
  if (!cdktf.canInspect(struct) || cdktf.Tokenization.isResolvable(struct)) { return struct; }
  if (cdktf.isComplexElement(struct)) {
    throw new Error("A complex element was used as configuration, this is not supported: https://cdk.tf/complex-object-as-configuration");
  }
  return {
    pn_id: cdktf.stringToTerraform(struct!.pnId),
    zone: cdktf.stringToTerraform(struct!.zone),
  }
}

export class InstanceServerPrivateNetworkOutputReference extends cdktf.ComplexObject {
  private isEmptyObject = false;
  private resolvableValue?: cdktf.IResolvable;

  /**
  * @param terraformResource The parent resource
  * @param terraformAttribute The attribute on the parent resource this class is referencing
  * @param complexObjectIndex the index of this item in the list
  * @param complexObjectIsFromSet whether the list is wrapping a set (will add tolist() to be able to access an item via an index)
  */
  public constructor(terraformResource: cdktf.IInterpolatingParent, terraformAttribute: string, complexObjectIndex: number, complexObjectIsFromSet: boolean) {
    super(terraformResource, terraformAttribute, complexObjectIsFromSet, complexObjectIndex);
  }

  public get internalValue(): InstanceServerPrivateNetwork | cdktf.IResolvable | undefined {
    if (this.resolvableValue) {
      return this.resolvableValue;
    }
    let hasAnyValues = this.isEmptyObject;
    const internalValueResult: any = {};
    if (this._pnId !== undefined) {
      hasAnyValues = true;
      internalValueResult.pnId = this._pnId;
    }
    if (this._zone !== undefined) {
      hasAnyValues = true;
      internalValueResult.zone = this._zone;
    }
    return hasAnyValues ? internalValueResult : undefined;
  }

  public set internalValue(value: InstanceServerPrivateNetwork | cdktf.IResolvable | undefined) {
    if (value === undefined) {
      this.isEmptyObject = false;
      this.resolvableValue = undefined;
      this._pnId = undefined;
      this._zone = undefined;
    }
    else if (cdktf.Tokenization.isResolvable(value)) {
      this.isEmptyObject = false;
      this.resolvableValue = value;
    }
    else {
      this.isEmptyObject = Object.keys(value).length === 0;
      this.resolvableValue = undefined;
      this._pnId = value.pnId;
      this._zone = value.zone;
    }
  }

  // mac_address - computed: true, optional: false, required: false
  public get macAddress() {
    return this.getStringAttribute('mac_address');
  }

  // pn_id - computed: false, optional: false, required: true
  private _pnId?: string; 
  public get pnId() {
    return this.getStringAttribute('pn_id');
  }
  public set pnId(value: string) {
    this._pnId = value;
  }
  // Temporarily expose input value. Use with caution.
  public get pnIdInput() {
    return this._pnId;
  }

  // status - computed: true, optional: false, required: false
  public get status() {
    return this.getStringAttribute('status');
  }

  // zone - computed: true, optional: true, required: false
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
}

export class InstanceServerPrivateNetworkList extends cdktf.ComplexList {
  public internalValue? : InstanceServerPrivateNetwork[] | cdktf.IResolvable

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
  public get(index: number): InstanceServerPrivateNetworkOutputReference {
    return new InstanceServerPrivateNetworkOutputReference(this.terraformResource, this.terraformAttribute, index, this.wrapsSet);
  }
}
export interface InstanceServerRootVolume {
  /**
  * Set the volume where the boot the server
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/r/instance_server#boot InstanceServer#boot}
  */
  readonly boot?: boolean | cdktf.IResolvable;
  /**
  * Force deletion of the root volume on instance termination
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/r/instance_server#delete_on_termination InstanceServer#delete_on_termination}
  */
  readonly deleteOnTermination?: boolean | cdktf.IResolvable;
  /**
  * Size of the root volume in gigabytes
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/r/instance_server#size_in_gb InstanceServer#size_in_gb}
  */
  readonly sizeInGb?: number;
  /**
  * Volume ID of the root volume
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/r/instance_server#volume_id InstanceServer#volume_id}
  */
  readonly volumeId?: string;
  /**
  * Volume type of the root volume
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/r/instance_server#volume_type InstanceServer#volume_type}
  */
  readonly volumeType?: string;
}

export function instanceServerRootVolumeToTerraform(struct?: InstanceServerRootVolumeOutputReference | InstanceServerRootVolume): any {
  if (!cdktf.canInspect(struct) || cdktf.Tokenization.isResolvable(struct)) { return struct; }
  if (cdktf.isComplexElement(struct)) {
    throw new Error("A complex element was used as configuration, this is not supported: https://cdk.tf/complex-object-as-configuration");
  }
  return {
    boot: cdktf.booleanToTerraform(struct!.boot),
    delete_on_termination: cdktf.booleanToTerraform(struct!.deleteOnTermination),
    size_in_gb: cdktf.numberToTerraform(struct!.sizeInGb),
    volume_id: cdktf.stringToTerraform(struct!.volumeId),
    volume_type: cdktf.stringToTerraform(struct!.volumeType),
  }
}

export class InstanceServerRootVolumeOutputReference extends cdktf.ComplexObject {
  private isEmptyObject = false;

  /**
  * @param terraformResource The parent resource
  * @param terraformAttribute The attribute on the parent resource this class is referencing
  */
  public constructor(terraformResource: cdktf.IInterpolatingParent, terraformAttribute: string) {
    super(terraformResource, terraformAttribute, false, 0);
  }

  public get internalValue(): InstanceServerRootVolume | undefined {
    let hasAnyValues = this.isEmptyObject;
    const internalValueResult: any = {};
    if (this._boot !== undefined) {
      hasAnyValues = true;
      internalValueResult.boot = this._boot;
    }
    if (this._deleteOnTermination !== undefined) {
      hasAnyValues = true;
      internalValueResult.deleteOnTermination = this._deleteOnTermination;
    }
    if (this._sizeInGb !== undefined) {
      hasAnyValues = true;
      internalValueResult.sizeInGb = this._sizeInGb;
    }
    if (this._volumeId !== undefined) {
      hasAnyValues = true;
      internalValueResult.volumeId = this._volumeId;
    }
    if (this._volumeType !== undefined) {
      hasAnyValues = true;
      internalValueResult.volumeType = this._volumeType;
    }
    return hasAnyValues ? internalValueResult : undefined;
  }

  public set internalValue(value: InstanceServerRootVolume | undefined) {
    if (value === undefined) {
      this.isEmptyObject = false;
      this._boot = undefined;
      this._deleteOnTermination = undefined;
      this._sizeInGb = undefined;
      this._volumeId = undefined;
      this._volumeType = undefined;
    }
    else {
      this.isEmptyObject = Object.keys(value).length === 0;
      this._boot = value.boot;
      this._deleteOnTermination = value.deleteOnTermination;
      this._sizeInGb = value.sizeInGb;
      this._volumeId = value.volumeId;
      this._volumeType = value.volumeType;
    }
  }

  // boot - computed: false, optional: true, required: false
  private _boot?: boolean | cdktf.IResolvable; 
  public get boot() {
    return this.getBooleanAttribute('boot');
  }
  public set boot(value: boolean | cdktf.IResolvable) {
    this._boot = value;
  }
  public resetBoot() {
    this._boot = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get bootInput() {
    return this._boot;
  }

  // delete_on_termination - computed: false, optional: true, required: false
  private _deleteOnTermination?: boolean | cdktf.IResolvable; 
  public get deleteOnTermination() {
    return this.getBooleanAttribute('delete_on_termination');
  }
  public set deleteOnTermination(value: boolean | cdktf.IResolvable) {
    this._deleteOnTermination = value;
  }
  public resetDeleteOnTermination() {
    this._deleteOnTermination = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get deleteOnTerminationInput() {
    return this._deleteOnTermination;
  }

  // name - computed: true, optional: false, required: false
  public get name() {
    return this.getStringAttribute('name');
  }

  // size_in_gb - computed: true, optional: true, required: false
  private _sizeInGb?: number; 
  public get sizeInGb() {
    return this.getNumberAttribute('size_in_gb');
  }
  public set sizeInGb(value: number) {
    this._sizeInGb = value;
  }
  public resetSizeInGb() {
    this._sizeInGb = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get sizeInGbInput() {
    return this._sizeInGb;
  }

  // volume_id - computed: true, optional: true, required: false
  private _volumeId?: string; 
  public get volumeId() {
    return this.getStringAttribute('volume_id');
  }
  public set volumeId(value: string) {
    this._volumeId = value;
  }
  public resetVolumeId() {
    this._volumeId = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get volumeIdInput() {
    return this._volumeId;
  }

  // volume_type - computed: true, optional: true, required: false
  private _volumeType?: string; 
  public get volumeType() {
    return this.getStringAttribute('volume_type');
  }
  public set volumeType(value: string) {
    this._volumeType = value;
  }
  public resetVolumeType() {
    this._volumeType = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get volumeTypeInput() {
    return this._volumeType;
  }
}
export interface InstanceServerTimeouts {
  /**
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/r/instance_server#create InstanceServer#create}
  */
  readonly create?: string;
  /**
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/r/instance_server#default InstanceServer#default}
  */
  readonly default?: string;
  /**
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/r/instance_server#delete InstanceServer#delete}
  */
  readonly delete?: string;
  /**
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/r/instance_server#read InstanceServer#read}
  */
  readonly read?: string;
  /**
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/r/instance_server#update InstanceServer#update}
  */
  readonly update?: string;
}

export function instanceServerTimeoutsToTerraform(struct?: InstanceServerTimeoutsOutputReference | InstanceServerTimeouts | cdktf.IResolvable): any {
  if (!cdktf.canInspect(struct) || cdktf.Tokenization.isResolvable(struct)) { return struct; }
  if (cdktf.isComplexElement(struct)) {
    throw new Error("A complex element was used as configuration, this is not supported: https://cdk.tf/complex-object-as-configuration");
  }
  return {
    create: cdktf.stringToTerraform(struct!.create),
    default: cdktf.stringToTerraform(struct!.default),
    delete: cdktf.stringToTerraform(struct!.delete),
    read: cdktf.stringToTerraform(struct!.read),
    update: cdktf.stringToTerraform(struct!.update),
  }
}

export class InstanceServerTimeoutsOutputReference extends cdktf.ComplexObject {
  private isEmptyObject = false;
  private resolvableValue?: cdktf.IResolvable;

  /**
  * @param terraformResource The parent resource
  * @param terraformAttribute The attribute on the parent resource this class is referencing
  */
  public constructor(terraformResource: cdktf.IInterpolatingParent, terraformAttribute: string) {
    super(terraformResource, terraformAttribute, false, 0);
  }

  public get internalValue(): InstanceServerTimeouts | cdktf.IResolvable | undefined {
    if (this.resolvableValue) {
      return this.resolvableValue;
    }
    let hasAnyValues = this.isEmptyObject;
    const internalValueResult: any = {};
    if (this._create !== undefined) {
      hasAnyValues = true;
      internalValueResult.create = this._create;
    }
    if (this._default !== undefined) {
      hasAnyValues = true;
      internalValueResult.default = this._default;
    }
    if (this._delete !== undefined) {
      hasAnyValues = true;
      internalValueResult.delete = this._delete;
    }
    if (this._read !== undefined) {
      hasAnyValues = true;
      internalValueResult.read = this._read;
    }
    if (this._update !== undefined) {
      hasAnyValues = true;
      internalValueResult.update = this._update;
    }
    return hasAnyValues ? internalValueResult : undefined;
  }

  public set internalValue(value: InstanceServerTimeouts | cdktf.IResolvable | undefined) {
    if (value === undefined) {
      this.isEmptyObject = false;
      this.resolvableValue = undefined;
      this._create = undefined;
      this._default = undefined;
      this._delete = undefined;
      this._read = undefined;
      this._update = undefined;
    }
    else if (cdktf.Tokenization.isResolvable(value)) {
      this.isEmptyObject = false;
      this.resolvableValue = value;
    }
    else {
      this.isEmptyObject = Object.keys(value).length === 0;
      this.resolvableValue = undefined;
      this._create = value.create;
      this._default = value.default;
      this._delete = value.delete;
      this._read = value.read;
      this._update = value.update;
    }
  }

  // create - computed: false, optional: true, required: false
  private _create?: string; 
  public get create() {
    return this.getStringAttribute('create');
  }
  public set create(value: string) {
    this._create = value;
  }
  public resetCreate() {
    this._create = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get createInput() {
    return this._create;
  }

  // default - computed: false, optional: true, required: false
  private _default?: string; 
  public get default() {
    return this.getStringAttribute('default');
  }
  public set default(value: string) {
    this._default = value;
  }
  public resetDefault() {
    this._default = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get defaultInput() {
    return this._default;
  }

  // delete - computed: false, optional: true, required: false
  private _delete?: string; 
  public get delete() {
    return this.getStringAttribute('delete');
  }
  public set delete(value: string) {
    this._delete = value;
  }
  public resetDelete() {
    this._delete = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get deleteInput() {
    return this._delete;
  }

  // read - computed: false, optional: true, required: false
  private _read?: string; 
  public get read() {
    return this.getStringAttribute('read');
  }
  public set read(value: string) {
    this._read = value;
  }
  public resetRead() {
    this._read = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get readInput() {
    return this._read;
  }

  // update - computed: false, optional: true, required: false
  private _update?: string; 
  public get update() {
    return this.getStringAttribute('update');
  }
  public set update(value: string) {
    this._update = value;
  }
  public resetUpdate() {
    this._update = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get updateInput() {
    return this._update;
  }
}

/**
* Represents a {@link https://www.terraform.io/docs/providers/scaleway/r/instance_server scaleway_instance_server}
*/
export class InstanceServer extends cdktf.TerraformResource {

  // =================
  // STATIC PROPERTIES
  // =================
  public static readonly tfResourceType = "scaleway_instance_server";

  // ===========
  // INITIALIZER
  // ===========

  /**
  * Create a new {@link https://www.terraform.io/docs/providers/scaleway/r/instance_server scaleway_instance_server} Resource
  *
  * @param scope The scope in which to define this construct
  * @param id The scoped construct ID. Must be unique amongst siblings in the same scope
  * @param options InstanceServerConfig
  */
  public constructor(scope: Construct, id: string, config: InstanceServerConfig) {
    super(scope, id, {
      terraformResourceType: 'scaleway_instance_server',
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
    this._additionalVolumeIds = config.additionalVolumeIds;
    this._bootType = config.bootType;
    this._bootscriptId = config.bootscriptId;
    this._cloudInit = config.cloudInit;
    this._enableDynamicIp = config.enableDynamicIp;
    this._enableIpv6 = config.enableIpv6;
    this._id = config.id;
    this._image = config.image;
    this._ipId = config.ipId;
    this._name = config.name;
    this._placementGroupId = config.placementGroupId;
    this._projectId = config.projectId;
    this._securityGroupId = config.securityGroupId;
    this._state = config.state;
    this._tags = config.tags;
    this._type = config.type;
    this._userData = config.userData;
    this._zone = config.zone;
    this._privateNetwork.internalValue = config.privateNetwork;
    this._rootVolume.internalValue = config.rootVolume;
    this._timeouts.internalValue = config.timeouts;
  }

  // ==========
  // ATTRIBUTES
  // ==========

  // additional_volume_ids - computed: false, optional: true, required: false
  private _additionalVolumeIds?: string[]; 
  public get additionalVolumeIds() {
    return this.getListAttribute('additional_volume_ids');
  }
  public set additionalVolumeIds(value: string[]) {
    this._additionalVolumeIds = value;
  }
  public resetAdditionalVolumeIds() {
    this._additionalVolumeIds = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get additionalVolumeIdsInput() {
    return this._additionalVolumeIds;
  }

  // boot_type - computed: false, optional: true, required: false
  private _bootType?: string; 
  public get bootType() {
    return this.getStringAttribute('boot_type');
  }
  public set bootType(value: string) {
    this._bootType = value;
  }
  public resetBootType() {
    this._bootType = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get bootTypeInput() {
    return this._bootType;
  }

  // bootscript_id - computed: true, optional: true, required: false
  private _bootscriptId?: string; 
  public get bootscriptId() {
    return this.getStringAttribute('bootscript_id');
  }
  public set bootscriptId(value: string) {
    this._bootscriptId = value;
  }
  public resetBootscriptId() {
    this._bootscriptId = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get bootscriptIdInput() {
    return this._bootscriptId;
  }

  // cloud_init - computed: true, optional: true, required: false
  private _cloudInit?: string; 
  public get cloudInit() {
    return this.getStringAttribute('cloud_init');
  }
  public set cloudInit(value: string) {
    this._cloudInit = value;
  }
  public resetCloudInit() {
    this._cloudInit = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get cloudInitInput() {
    return this._cloudInit;
  }

  // enable_dynamic_ip - computed: false, optional: true, required: false
  private _enableDynamicIp?: boolean | cdktf.IResolvable; 
  public get enableDynamicIp() {
    return this.getBooleanAttribute('enable_dynamic_ip');
  }
  public set enableDynamicIp(value: boolean | cdktf.IResolvable) {
    this._enableDynamicIp = value;
  }
  public resetEnableDynamicIp() {
    this._enableDynamicIp = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get enableDynamicIpInput() {
    return this._enableDynamicIp;
  }

  // enable_ipv6 - computed: false, optional: true, required: false
  private _enableIpv6?: boolean | cdktf.IResolvable; 
  public get enableIpv6() {
    return this.getBooleanAttribute('enable_ipv6');
  }
  public set enableIpv6(value: boolean | cdktf.IResolvable) {
    this._enableIpv6 = value;
  }
  public resetEnableIpv6() {
    this._enableIpv6 = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get enableIpv6Input() {
    return this._enableIpv6;
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

  // image - computed: false, optional: true, required: false
  private _image?: string; 
  public get image() {
    return this.getStringAttribute('image');
  }
  public set image(value: string) {
    this._image = value;
  }
  public resetImage() {
    this._image = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get imageInput() {
    return this._image;
  }

  // ip_id - computed: false, optional: true, required: false
  private _ipId?: string; 
  public get ipId() {
    return this.getStringAttribute('ip_id');
  }
  public set ipId(value: string) {
    this._ipId = value;
  }
  public resetIpId() {
    this._ipId = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get ipIdInput() {
    return this._ipId;
  }

  // ipv6_address - computed: true, optional: false, required: false
  public get ipv6Address() {
    return this.getStringAttribute('ipv6_address');
  }

  // ipv6_gateway - computed: true, optional: false, required: false
  public get ipv6Gateway() {
    return this.getStringAttribute('ipv6_gateway');
  }

  // ipv6_prefix_length - computed: true, optional: false, required: false
  public get ipv6PrefixLength() {
    return this.getNumberAttribute('ipv6_prefix_length');
  }

  // name - computed: true, optional: true, required: false
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

  // placement_group_id - computed: false, optional: true, required: false
  private _placementGroupId?: string; 
  public get placementGroupId() {
    return this.getStringAttribute('placement_group_id');
  }
  public set placementGroupId(value: string) {
    this._placementGroupId = value;
  }
  public resetPlacementGroupId() {
    this._placementGroupId = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get placementGroupIdInput() {
    return this._placementGroupId;
  }

  // placement_group_policy_respected - computed: true, optional: false, required: false
  public get placementGroupPolicyRespected() {
    return this.getBooleanAttribute('placement_group_policy_respected');
  }

  // private_ip - computed: true, optional: false, required: false
  public get privateIp() {
    return this.getStringAttribute('private_ip');
  }

  // project_id - computed: true, optional: true, required: false
  private _projectId?: string; 
  public get projectId() {
    return this.getStringAttribute('project_id');
  }
  public set projectId(value: string) {
    this._projectId = value;
  }
  public resetProjectId() {
    this._projectId = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get projectIdInput() {
    return this._projectId;
  }

  // public_ip - computed: true, optional: false, required: false
  public get publicIp() {
    return this.getStringAttribute('public_ip');
  }

  // security_group_id - computed: true, optional: true, required: false
  private _securityGroupId?: string; 
  public get securityGroupId() {
    return this.getStringAttribute('security_group_id');
  }
  public set securityGroupId(value: string) {
    this._securityGroupId = value;
  }
  public resetSecurityGroupId() {
    this._securityGroupId = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get securityGroupIdInput() {
    return this._securityGroupId;
  }

  // state - computed: false, optional: true, required: false
  private _state?: string; 
  public get state() {
    return this.getStringAttribute('state');
  }
  public set state(value: string) {
    this._state = value;
  }
  public resetState() {
    this._state = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get stateInput() {
    return this._state;
  }

  // tags - computed: false, optional: true, required: false
  private _tags?: string[]; 
  public get tags() {
    return this.getListAttribute('tags');
  }
  public set tags(value: string[]) {
    this._tags = value;
  }
  public resetTags() {
    this._tags = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get tagsInput() {
    return this._tags;
  }

  // type - computed: false, optional: false, required: true
  private _type?: string; 
  public get type() {
    return this.getStringAttribute('type');
  }
  public set type(value: string) {
    this._type = value;
  }
  // Temporarily expose input value. Use with caution.
  public get typeInput() {
    return this._type;
  }

  // user_data - computed: true, optional: true, required: false
  private _userData?: { [key: string]: string }; 
  public get userData() {
    return this.getStringMapAttribute('user_data');
  }
  public set userData(value: { [key: string]: string }) {
    this._userData = value;
  }
  public resetUserData() {
    this._userData = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get userDataInput() {
    return this._userData;
  }

  // zone - computed: true, optional: true, required: false
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

  // private_network - computed: false, optional: true, required: false
  private _privateNetwork = new InstanceServerPrivateNetworkList(this, "private_network", false);
  public get privateNetwork() {
    return this._privateNetwork;
  }
  public putPrivateNetwork(value: InstanceServerPrivateNetwork[] | cdktf.IResolvable) {
    this._privateNetwork.internalValue = value;
  }
  public resetPrivateNetwork() {
    this._privateNetwork.internalValue = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get privateNetworkInput() {
    return this._privateNetwork.internalValue;
  }

  // root_volume - computed: false, optional: true, required: false
  private _rootVolume = new InstanceServerRootVolumeOutputReference(this, "root_volume");
  public get rootVolume() {
    return this._rootVolume;
  }
  public putRootVolume(value: InstanceServerRootVolume) {
    this._rootVolume.internalValue = value;
  }
  public resetRootVolume() {
    this._rootVolume.internalValue = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get rootVolumeInput() {
    return this._rootVolume.internalValue;
  }

  // timeouts - computed: false, optional: true, required: false
  private _timeouts = new InstanceServerTimeoutsOutputReference(this, "timeouts");
  public get timeouts() {
    return this._timeouts;
  }
  public putTimeouts(value: InstanceServerTimeouts) {
    this._timeouts.internalValue = value;
  }
  public resetTimeouts() {
    this._timeouts.internalValue = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get timeoutsInput() {
    return this._timeouts.internalValue;
  }

  // =========
  // SYNTHESIS
  // =========

  protected synthesizeAttributes(): { [name: string]: any } {
    return {
      additional_volume_ids: cdktf.listMapper(cdktf.stringToTerraform, false)(this._additionalVolumeIds),
      boot_type: cdktf.stringToTerraform(this._bootType),
      bootscript_id: cdktf.stringToTerraform(this._bootscriptId),
      cloud_init: cdktf.stringToTerraform(this._cloudInit),
      enable_dynamic_ip: cdktf.booleanToTerraform(this._enableDynamicIp),
      enable_ipv6: cdktf.booleanToTerraform(this._enableIpv6),
      id: cdktf.stringToTerraform(this._id),
      image: cdktf.stringToTerraform(this._image),
      ip_id: cdktf.stringToTerraform(this._ipId),
      name: cdktf.stringToTerraform(this._name),
      placement_group_id: cdktf.stringToTerraform(this._placementGroupId),
      project_id: cdktf.stringToTerraform(this._projectId),
      security_group_id: cdktf.stringToTerraform(this._securityGroupId),
      state: cdktf.stringToTerraform(this._state),
      tags: cdktf.listMapper(cdktf.stringToTerraform, false)(this._tags),
      type: cdktf.stringToTerraform(this._type),
      user_data: cdktf.hashMapper(cdktf.stringToTerraform)(this._userData),
      zone: cdktf.stringToTerraform(this._zone),
      private_network: cdktf.listMapper(instanceServerPrivateNetworkToTerraform, true)(this._privateNetwork.internalValue),
      root_volume: instanceServerRootVolumeToTerraform(this._rootVolume.internalValue),
      timeouts: instanceServerTimeoutsToTerraform(this._timeouts.internalValue),
    };
  }
}
