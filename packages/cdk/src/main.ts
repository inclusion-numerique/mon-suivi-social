#!/usr/bin/env node
import { App } from 'cdktf'
import { WebAppStack } from '@mss/cdk/WebAppStack'
import { ProjectStack } from '@mss/cdk/ProjectStack'
import { getBranch } from './utils'

const app = new App()

const branch = getBranch()

new WebAppStack(app, branch)
new ProjectStack(app)

app.synth()
