# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

# [0.16.0](https://github.com/dmnsgn/dgel/compare/v0.15.0...v0.16.0) (2023-05-13)


### Features

* rename dispatch to dispatchWorkgroups ([9676382](https://github.com/dmnsgn/dgel/commit/9676382421ae4db2e602f587860bed261c0a7021))



# [0.15.0](https://github.com/dmnsgn/dgel/compare/v0.14.0...v0.15.0) (2023-02-19)


### Features

* make BindGroupeLayout getBindGroupSize return a multiple of 16 bytes ([d48d614](https://github.com/dmnsgn/dgel/commit/d48d6146193fe26f1fe879dc3e3252ed82571b6e))



# [0.14.0](https://github.com/dmnsgn/dgel/compare/v0.13.0...v0.14.0) (2022-09-17)


### Bug Fixes

* 'of' is a reserved keyword ([0f31771](https://github.com/dmnsgn/dgel/commit/0f31771ba8a4f9149c5c32f237138ed8e33b098a))
* module-scope 'let' has been replaced with 'const' ([67d9903](https://github.com/dmnsgn/dgel/commit/67d99032a63fd342c2be940a9a92e56fad49a9c2))


### Features

* add willReadFrequently to Texture's canvas 2d ([64e2652](https://github.com/dmnsgn/dgel/commit/64e2652cb8d6cf5c0f703767b9e48cccc52f7699))
* saturate is now a builtin in wgsl ([7066711](https://github.com/dmnsgn/dgel/commit/70667117c68f48bab9f321e6694fde3d846ab08b))



# [0.13.0](https://github.com/dmnsgn/dgel/compare/v0.12.0...v0.13.0) (2022-06-27)


### Bug Fixes

* remove size from configure ([a66b8fd](https://github.com/dmnsgn/dgel/commit/a66b8fd4a1e7eeeb6988b3f95877f35ea2f472e7))
* use of deprecated language feature: remove stage ([6daa13a](https://github.com/dmnsgn/dgel/commit/6daa13a72215a5cde26aacc3a053727e3c2dcc2a))


### Features

* default to layout auto in Pipeline ([8a0c1ed](https://github.com/dmnsgn/dgel/commit/8a0c1edb8d90088a9777fab3628db737e483e9b9))
* use alphaMode instead of compositingAlphaMode ([2a2853d](https://github.com/dmnsgn/dgel/commit/2a2853d41aa7953a83489d0ba04eea4494400a84))
* use navigator.gpu.getPreferredCanvasFormat ([4fde41e](https://github.com/dmnsgn/dgel/commit/4fde41e9823bd8bb087b82ac8a2d1b194ded8bf1))



# [0.12.0](https://github.com/dmnsgn/dgel/compare/v0.11.0...v0.12.0) (2022-04-13)


### Bug Fixes

* struct members should be separated with commas ([fed3788](https://github.com/dmnsgn/dgel/commit/fed37884b6334b5ce738542bca5f3f66cb303420))


### Features

* add compositingAlphaMode ([4bce529](https://github.com/dmnsgn/dgel/commit/4bce5298c731979b20d05a1fb5c67fc26f7b8a69))



# [0.11.0](https://github.com/dmnsgn/dgel/compare/v0.10.0...v0.11.0) (2022-03-04)


### Features

* update to new API ([2b288f9](https://github.com/dmnsgn/dgel/commit/2b288f9c5375f10925550c8939662b5f71734196))



# [0.10.0](https://github.com/dmnsgn/dgel/compare/v0.9.0...v0.10.0) (2021-12-24)


### Bug Fixes

* texture sample type to binding mapping ([277ecd4](https://github.com/dmnsgn/dgel/commit/277ecd4b210df86250c7e5802cab633321291052))


### Features

* add helper pipeline options ([4bef935](https://github.com/dmnsgn/dgel/commit/4bef9357f43b22bcdb499b17b5d10a3307edab3b))



# [0.9.0](https://github.com/dmnsgn/dgel/compare/v0.8.0...v0.9.0) (2021-12-15)


### Bug Fixes

* add missing view property to Pass descriptor getter + add new Attachment options ([53e1636](https://github.com/dmnsgn/dgel/commit/53e16369690dde403d7c3247b9767b366429635e)), closes [#10](https://github.com/dmnsgn/dgel/issues/10)
* remove deprecated [[block]] ([24b0e7e](https://github.com/dmnsgn/dgel/commit/24b0e7e74807bc2907faea473d7546c84459319b)), closes [#9](https://github.com/dmnsgn/dgel/issues/9)



# [0.8.0](https://github.com/dmnsgn/dgel/compare/v0.7.0...v0.8.0) (2021-12-12)


### Features

* add pixelRatio to Context and handle scaled resize ([916c7ab](https://github.com/dmnsgn/dgel/commit/916c7ab2f91d0a44151a11e7c6fbf932b207a620)), closes [#8](https://github.com/dmnsgn/dgel/issues/8)



# [0.7.0](https://github.com/dmnsgn/dgel/compare/v0.6.0...v0.7.0) (2021-10-27)


### Features

* add wgsl support ([b54a301](https://github.com/dmnsgn/dgel/commit/b54a301fea213db503646bb5f40636f38de2b603))



# [0.6.0](https://github.com/dmnsgn/dgel/compare/v0.5.0...v0.6.0) (2021-10-02)


### Features

* add exports field to package.json ([3519074](https://github.com/dmnsgn/dgel/commit/35190747281d82a43b555a2b484898da94e7ee6b))



# [0.5.0](https://github.com/dmnsgn/dgel/compare/v0.4.1...v0.5.0) (2021-08-26)


### Features

* update to latest api ([bec8800](https://github.com/dmnsgn/dgel/commit/bec8800795747bb90f742b3d33df595d848a61fc))
* update to latest api ([4a88011](https://github.com/dmnsgn/dgel/commit/4a88011141001dafaba27bf3fecb2e35c11a8fe3))



## [0.4.1](https://github.com/dmnsgn/dgel/compare/v0.4.0...v0.4.1) (2021-04-22)


### Bug Fixes

* replace attachment with view in render pass ([d5da76f](https://github.com/dmnsgn/dgel/commit/d5da76ff2de359c07404b94164e479374c635db2))



# [0.4.0](https://github.com/dmnsgn/dgel/compare/v0.3.0...v0.4.0) (2021-04-16)


### Features

* update to latest api + move to snowdev ([a9a2d1f](https://github.com/dmnsgn/dgel/commit/a9a2d1f6bf6d46c87c4a7cf39bde66666f777c88))
