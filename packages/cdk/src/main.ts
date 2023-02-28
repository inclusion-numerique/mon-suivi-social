#!/usr/bin/env node
import { App } from 'cdktf'
import { WebAppStack } from '@mss/cdk/WebAppStack'
import { getBranch } from './utils'

const app = new App()

const branch = getBranch()

new WebAppStack(app, `web`, branch)

app.synth()
