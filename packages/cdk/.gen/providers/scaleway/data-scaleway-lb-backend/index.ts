// https://www.terraform.io/docs/providers/scaleway/d/lb_backend
// generated from terraform resource schema

import { Construct } from 'constructs';
import * as cdktf from 'cdktf';

// Configuration

export interface DataScalewayLbBackendConfig extends cdktf.TerraformMetaArguments {
  /**
  * The ID of the backend
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/d/lb_backend#backend_id DataScalewayLbBackend#backend_id}
  */
  readonly backendId?: string;
  /**
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/d/lb_backend#id DataScalewayLbBackend#id}
  *
  * Please be aware that the id field is automatically added to all resources in Terraform providers using a Terraform provider SDK version below 2.
  * If you experience problems setting this value it might not be settable. Please take a look at the provider documentation to ensure it should be settable.
  */
  readonly id?: string;
  /**
  * The load-balancer ID
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/d/lb_backend#lb_id DataScalewayLbBackend#lb_id}
  */
  readonly lbId?: string;
  /**
  * The name of the backend
  * 
  * Docs at Terraform Registry: {@link https://www.terraform.io/docs/providers/scaleway/d/lb_backend#name DataScalewayLbBackend#name}
  */
  readonly name?: string;
}
export interface DataScalewayLbBackendHealthCheckHttp {
}

export function dataScalewayLbBackendHealthCheckHttpToTerraform(struct?: DataScalewayLbBackendHealthCheckHttp): any {
  if (!cdktf.canInspect(struct) || cdktf.Tokenization.isResolvable(struct)) { return struct; }
  if (cdktf.isComplexElement(struct)) {
    throw new Error("A complex element was used as configuration, this is not supported: https://cdk.tf/complex-object-as-configuration");
  }
  return {
  }
}

export class DataScalewayLbBackendHealthCheckHttpOutputReference extends cdktf.ComplexObject {
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

  public get internalValue(): DataScalewayLbBackendHealthCheckHttp | undefined {
    let hasAnyValues = this.isEmptyObject;
    const internalValueResult: any = {};
    return hasAnyValues ? internalValueResult : undefined;
  }

  public set internalValue(value: DataScalewayLbBackendHealthCheckHttp | undefined) {
    if (value === undefined) {
      this.isEmptyObject = false;
    }
    else {
      this.isEmptyObject = Object.keys(value).length === 0;
    }
  }

  // code - computed: true, optional: false, required: false
  public get code() {
    return this.getNumberAttribute('code');
  }

  // host_header - computed: true, optional: false, required: false
  public get hostHeader() {
    return this.getStringAttribute('host_header');
  }

  // method - computed: true, optional: false, required: false
  public get method() {
    return this.getStringAttribute('method');
  }

  // uri - computed: true, optional: false, required: false
  public get uri() {
    return this.getStringAttribute('uri');
  }
}

export class DataScalewayLbBackendHealthCheckHttpList extends cdktf.ComplexList {

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
  public get(index: number): DataScalewayLbBackendHealthCheckHttpOutputReference {
    return new DataScalewayLbBackendHealthCheckHttpOutputReference(this.terraformResource, this.terraformAttribute, index, this.wrapsSet);
  }
}
export interface DataScalewayLbBackendHealthCheckHttps {
}

export function dataScalewayLbBackendHealthCheckHttpsToTerraform(struct?: DataScalewayLbBackendHealthCheckHttps): any {
  if (!cdktf.canInspect(struct) || cdktf.Tokenization.isResolvable(struct)) { return struct; }
  if (cdktf.isComplexElement(struct)) {
    throw new Error("A complex element was used as configuration, this is not supported: https://cdk.tf/complex-object-as-configuration");
  }
  return {
  }
}

export class DataScalewayLbBackendHealthCheckHttpsOutputReference extends cdktf.ComplexObject {
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

  public get internalValue(): DataScalewayLbBackendHealthCheckHttps | undefined {
    let hasAnyValues = this.isEmptyObject;
    const internalValueResult: any = {};
    return hasAnyValues ? internalValueResult : undefined;
  }

  public set internalValue(value: DataScalewayLbBackendHealthCheckHttps | undefined) {
    if (value === undefined) {
      this.isEmptyObject = false;
    }
    else {
      this.isEmptyObject = Object.keys(value).length === 0;
    }
  }

  // code - computed: true, optional: false, required: false
  public get code() {
    return this.getNumberAttribute('code');
  }

  // host_header - computed: true, optional: false, required: false
  public get hostHeader() {
    return this.getStringAttribute('host_header');
  }

  // method - computed: true, optional: false, required: false
  public get method() {
    return this.getStringAttribute('method');
  }

  // sni - computed: true, optional: false, required: false
  public get sni() {
    return this.getStringAttribute('sni');
  }

  // uri - computed: true, optional: false, required: false
  public get uri() {
    return this.getStringAttribute('uri');
  }
}

export class DataScalewayLbBackendHealthCheckHttpsList extends cdktf.ComplexList {

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
  public get(index: number): DataScalewayLbBackendHealthCheckHttpsOutputReference {
    return new DataScalewayLbBackendHealthCheckHttpsOutputReference(this.terraformResource, this.terraformAttribute, index, this.wrapsSet);
  }
}
export interface DataScalewayLbBackendHealthCheckTcp {
}

export function dataScalewayLbBackendHealthCheckTcpToTerraform(struct?: DataScalewayLbBackendHealthCheckTcp): any {
  if (!cdktf.canInspect(struct) || cdktf.Tokenization.isResolvable(struct)) { return struct; }
  if (cdktf.isComplexElement(struct)) {
    throw new Error("A complex element was used as configuration, this is not supported: https://cdk.tf/complex-object-as-configuration");
  }
  return {
  }
}

export class DataScalewayLbBackendHealthCheckTcpOutputReference extends cdktf.ComplexObject {
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

  public get internalValue(): DataScalewayLbBackendHealthCheckTcp | undefined {
    let hasAnyValues = this.isEmptyObject;
    const internalValueResult: any = {};
    return hasAnyValues ? internalValueResult : undefined;
  }

  public set internalValue(value: DataScalewayLbBackendHealthCheckTcp | undefined) {
    if (value === undefined) {
      this.isEmptyObject = false;
    }
    else {
      this.isEmptyObject = Object.keys(value).length === 0;
    }
  }
}

export class DataScalewayLbBackendHealthCheckTcpList extends cdktf.ComplexList {

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
  public get(index: number): DataScalewayLbBackendHealthCheckTcpOutputReference {
    return new DataScalewayLbBackendHealthCheckTcpOutputReference(this.terraformResource, this.terraformAttribute, index, this.wrapsSet);
  }
}

/**
* Represents a {@link https://www.terraform.io/docs/providers/scaleway/d/lb_backend scaleway_lb_backend}
*/
export class DataScalewayLbBackend extends cdktf.TerraformDataSource {

  // =================
  // STATIC PROPERTIES
  // =================
  public static readonly tfResourceType = "scaleway_lb_backend";

  // ===========
  // INITIALIZER
  // ===========

  /**
  * Create a new {@link https://www.terraform.io/docs/providers/scaleway/d/lb_backend scaleway_lb_backend} Data Source
  *
  * @param scope The scope in which to define this construct
  * @param id The scoped construct ID. Must be unique amongst siblings in the same scope
  * @param options DataScalewayLbBackendConfig = {}
  */
  public constructor(scope: Construct, id: string, config: DataScalewayLbBackendConfig = {}) {
    super(scope, id, {
      terraformResourceType: 'scaleway_lb_backend',
      terraformGeneratorMetadata: {
        providerName: 'scaleway',
        providerVersion: '2.13.1',
        providerVersionConstraint: '>= 2.13.1'
      },
      provider: config.provider,
      dependsOn: config.dependsOn,
      count: config.count,
      lifecycle: config.lifecycle,
      provisioners: config.provisioners,
      connection: config.connection,
      forEach: config.forEach
    });
    this._backendId = config.backendId;
    this._id = config.id;
    this._lbId = config.lbId;
    this._name = config.name;
  }

  // ==========
  // ATTRIBUTES
  // ==========

  // backend_id - computed: false, optional: true, required: false
  private _backendId?: string; 
  public get backendId() {
    return this.getStringAttribute('backend_id');
  }
  public set backendId(value: string) {
    this._backendId = value;
  }
  public resetBackendId() {
    this._backendId = undefined;
  }
  // Temporarily expose input value. Use with caution.
  public get backendIdInput() {
    return this._backendId;
  }

  // failover_host - computed: true, optional: false, required: false
  public get failoverHost() {
    return this.getStringAttribute('failover_host');
  }

  // forward_port - computed: true, optional: false, required: false
  public get forwardPort() {
    return this.getNumberAttribute('forward_port');
  }

  // forward_port_algorithm - computed: true, optional: false, required: false
  public get forwardPortAlgorithm() {
    return this.getStringAttribute('forward_port_algorithm');
  }

  // forward_protocol - computed: true, optional: false, required: false
  public get forwardProtocol() {
    return this.getStringAttribute('forward_protocol');
  }

  // health_check_delay - computed: true, optional: false, required: false
  public get healthCheckDelay() {
    return this.getStringAttribute('health_check_delay');
  }

  // health_check_http - computed: true, optional: false, required: false
  private _healthCheckHttp = new DataScalewayLbBackendHealthCheckHttpList(this, "health_check_http", false);
  public get healthCheckHttp() {
    return this._healthCheckHttp;
  }

  // health_check_https - computed: true, optional: false, required: false
  private _healthCheckHttps = new DataScalewayLbBackendHealthCheckHttpsList(this, "health_check_https", false);
  public get healthCheckHttps() {
    return this._healthCheckHttps;
  }

  // health_check_max_retries - computed: true, optional: false, required: false
  public get healthCheckMaxRetries() {
    return this.getNumberAttribute('health_check_max_retries');
  }

  // health_check_port - computed: true, optional: false, required: false
  public get healthCheckPort() {
    return this.getNumberAttribute('health_check_port');
  }

  // health_check_tcp - computed: true, optional: false, required: false
  private _healthCheckTcp = new DataScalewayLbBackendHealthCheckTcpList(this, "health_check_tcp", false);
  public get healthCheckTcp() {
    return this._healthCheckTcp;
  }

  // health_check_timeout - computed: true, optional: false, required: false
  public get healthCheckTimeout() {
    return this.getStringAttribute('health_check_timeout');
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

  // ignore_ssl_server_verify - computed: true, optional: false, required: false
  public get ignoreSslServerVerify() {
    return this.getBooleanAttribute('ignore_ssl_server_verify');
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

  // on_marked_down_action - computed: true, optional: false, required: false
  public get onMarkedDownAction() {
    return this.getStringAttribute('on_marked_down_action');
  }

  // proxy_protocol - computed: true, optional: false, required: false
  public get proxyProtocol() {
    return this.getStringAttribute('proxy_protocol');
  }

  // send_proxy_v2 - computed: true, optional: false, required: false
  public get sendProxyV2() {
    return this.getBooleanAttribute('send_proxy_v2');
  }

  // server_ips - computed: true, optional: false, required: false
  public get serverIps() {
    return this.getListAttribute('server_ips');
  }

  // ssl_bridging - computed: true, optional: false, required: false
  public get sslBridging() {
    return this.getBooleanAttribute('ssl_bridging');
  }

  // sticky_sessions - computed: true, optional: false, required: false
  public get stickySessions() {
    return this.getStringAttribute('sticky_sessions');
  }

  // sticky_sessions_cookie_name - computed: true, optional: false, required: false
  public get stickySessionsCookieName() {
    return this.getStringAttribute('sticky_sessions_cookie_name');
  }

  // timeout_connect - computed: true, optional: false, required: false
  public get timeoutConnect() {
    return this.getStringAttribute('timeout_connect');
  }

  // timeout_server - computed: true, optional: false, required: false
  public get timeoutServer() {
    return this.getStringAttribute('timeout_server');
  }

  // timeout_tunnel - computed: true, optional: false, required: false
  public get timeoutTunnel() {
    return this.getStringAttribute('timeout_tunnel');
  }

  // =========
  // SYNTHESIS
  // =========

  protected synthesizeAttributes(): { [name: string]: any } {
    return {
      backend_id: cdktf.stringToTerraform(this._backendId),
      id: cdktf.stringToTerraform(this._id),
      lb_id: cdktf.stringToTerraform(this._lbId),
      name: cdktf.stringToTerraform(this._name),
    };
  }
}
