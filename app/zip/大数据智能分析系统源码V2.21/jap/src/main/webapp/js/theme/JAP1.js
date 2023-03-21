(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['exports', 'echarts'], factory);
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        // CommonJS
        factory(exports, require('echarts'));
    } else {
        // Browser globals
        factory({}, root.echarts);
    }
}(this, function (exports, echarts) {
    var log = function (msg) {
        if (typeof console !== 'undefined') {
            console && console.error && console.error(msg);
        }
    };
    if (!echarts) {
        log('ECharts is not Loaded');
        return;
    }
    echarts.registerTheme('JAP', {
        "color": [
            "#e83828",
            "#347cae",
            "#cccc88",
            "#347cae",
            "#eeb02c"
        ],
//        "backgroundColor": "rgba(250,250,250,1)",
        "textStyle": {},
        "title": {
            "textStyle": {
                "color": "#7a7a7a"
            },
            "subtextStyle": {
                "color": "#d4d4d4"
            }
        },
        "line": {
            "itemStyle": {
                "normal": {
                    "borderWidth": "1"
                }
            },
            "lineStyle": {
                "normal": {
                    "width": "1"
                }
            },
            "symbolSize": "5",
            "symbol": "emptyCircle",
            "smooth": false
        },
        "radar": {
            "itemStyle": {
                "normal": {
                    "borderWidth": "1"
                }
            },
            "lineStyle": {
                "normal": {
                    "width": "1"
                }
            },
            "symbolSize": "5",
            "symbol": "emptyCircle",
            "smooth": false
        },
        "bar": {
            "itemStyle": {
                "normal": {
                    "barBorderWidth": 0,
                    "barBorderColor": "#ccc"
                },
                "emphasis": {
                    "barBorderWidth": 0,
                    "barBorderColor": "#ccc"
                }
            }
        },
        "pie": {
            "itemStyle": {
                "normal": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                }
            }
        },
        "scatter": {
            "itemStyle": {
                "normal": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                }
            }
        },
        "boxplot": {
            "itemStyle": {
                "normal": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                }
            }
        },
        "parallel": {
            "itemStyle": {
                "normal": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                }
            }
        },
        "sankey": {
            "itemStyle": {
                "normal": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                }
            }
        },
        "funnel": {
            "itemStyle": {
                "normal": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                }
            }
        },
        "gauge": {
            "itemStyle": {
                "normal": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                },
                "emphasis": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                }
            }
        },
        "candlestick": {
            "itemStyle": {
                "normal": {
                    "color": "#e83828",
                    "color0": "#119bff",
                    "borderColor": "#e83828",
                    "borderColor0": "#119bff",
                    "borderWidth": "1"
                }
            }
        },
        "graph": {
            "itemStyle": {
                "normal": {
                    "borderWidth": 0,
                    "borderColor": "#ccc"
                }
            },
            "lineStyle": {
                "normal": {
                    "width": 1,
                    "color": "#aaa"
                }
            },
            "symbolSize": "5",
            "symbol": "emptyCircle",
            "smooth": false,
            "color": [
                "#e83828",
                "#347cae",
                "#cccc88",
                "#347cae",
                "#eeb02c"
            ],
            "label": {
                "normal": {
                    "textStyle": {
                        "color": "#eee"
                    }
                }
            }
        },
        "map": {
            "itemStyle": {
                "normal": {
                    "areaColor": "#dddddd",
                    "borderColor": "#ffffff",
                    "borderWidth": ".5"
                },
                "emphasis": {
                    "areaColor": "rgba(232,37,37,1)",
                    "borderColor": "#ffffff",
                    "borderWidth": 1
                }
            },
            "label": {
                "normal": {
                    "textStyle": {
                        "color": "#ffffff"
                    }
                },
                "emphasis": {
                    "textStyle": {
                        "color": "rgb(255,255,255)"
                    }
                }
            }
        },
        "geo": {
            "itemStyle": {
                "normal": {
                    "areaColor": "#dddddd",
                    "borderColor": "#ffffff",
                    "borderWidth": ".5"
                },
                "emphasis": {
                    "areaColor": "rgba(232,37,37,1)",
                    "borderColor": "#ffffff",
                    "borderWidth": 1
                }
            },
            "label": {
                "normal": {
                    "textStyle": {
                        "color": "#ffffff"
                    }
                },
                "emphasis": {
                    "textStyle": {
                        "color": "rgb(255,255,255)"
                    }
                }
            }
        },
        "categoryAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "#dcdddd"
                }
            },
            "axisTick": {
                "show": true,
                "lineStyle": {
                    "color": "#dcdddd"
                }
            },
            "axisLabel": {
                "show": true,
                "textStyle": {
                    "color": "#dcdddd"
                }
            },
            "splitLine": {
                "show": false,
                "lineStyle": {
                    "color": [
                        "#ccc"
                    ]
                }
            },
            "splitArea": {
                "show": false,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.3)",
                        "rgba(200,200,200,0.3)"
                    ]
                }
            }
        },
        "valueAxis": {
            "axisLine": {
                "show": false,
                "lineStyle": {
                    "color": "#333"
                }
            },
            "axisTick": {
                "show": false,
                "lineStyle": {
                    "color": "#333"
                }
            },
            "axisLabel": {
                "show": true,
                "textStyle": {
                    "color": "#dcdddd"
                }
            },
            "splitLine": {
                "show": true,
                "lineStyle": {
                    "color": [
                        "#dcdddd"
                    ]
                }
            },
            "splitArea": {
                "show": false,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.3)",
                        "rgba(200,200,200,0.3)"
                    ]
                }
            }
        },
        "logAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "#dcdddd"
                }
            },
            "axisTick": {
                "show": true,
                "lineStyle": {
                    "color": "#dcdddd"
                }
            },
            "axisLabel": {
                "show": true,
                "textStyle": {
                    "color": "#dcdddd"
                }
            },
            "splitLine": {
                "show": true,
                "lineStyle": {
                    "color": [
                        "#dcdddd"
                    ]
                }
            },
            "splitArea": {
                "show": false,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.3)",
                        "rgba(200,200,200,0.3)"
                    ]
                }
            }
        },
        "timeAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "#dcdddd"
                }
            },
            "axisTick": {
                "show": true,
                "lineStyle": {
                    "color": "#dcdddd"
                }
            },
            "axisLabel": {
                "show": true,
                "textStyle": {
                    "color": "#dcdddd"
                }
            },
            "splitLine": {
                "show": true,
                "lineStyle": {
                    "color": [
                        "#dcdddd"
                    ]
                }
            },
            "splitArea": {
                "show": false,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.3)",
                        "rgba(200,200,200,0.3)"
                    ]
                }
            }
        },
        "toolbox": {
            "iconStyle": {
                "normal": {
                    "borderColor": "#dcdddd"
                },
                "emphasis": {
                    "borderColor": "#e83828"
                }
            }
        },
        "legend": {
            "textStyle": {
                "color": "#dcdddd"
            }
        },
        "tooltip": {
            "axisPointer": {
                "lineStyle": {
                    "color": "#e83828",
                    "width": 1
                },
                "crossStyle": {
                    "color": "#e83828",
                    "width": 1
                }
            }
        },
        "timeline": {
            "lineStyle": {
                "color": "#dcdddd",
                "width": "1"
            },
            "itemStyle": {
                "normal": {
                    "color": "#dcdddd",
                    "borderWidth": "1"
                },
                "emphasis": {
                    "color": "#e83828"
                }
            },
            "controlStyle": {
                "normal": {
                    "color": "#e83828",
                    "borderColor": "#e83828",
                    "borderWidth": "0"
                },
                "emphasis": {
                    "color": "#e83828",
                    "borderColor": "#e83828",
                    "borderWidth": "0"
                }
            },
            "checkpointStyle": {
                "color": "#e83828",
                "borderColor": "rgba(232,46,79,0.5)"
            },
            "label": {
                "normal": {
                    "textStyle": {
                        "color": "#dcdddd"
                    }
                },
                "emphasis": {
                    "textStyle": {
                        "color": "#dcdddd"
                    }
                }
            }
        },
        "visualMap": {
            "color": [
                "#e83828",
                "#ff9e68",
                "#ffdb96"
            ]
        },
        "dataZoom": {
            "backgroundColor": "rgba(0,0,0,0)",
            "dataBackgroundColor": "rgba(224,24,24,0.3)",
            "fillerColor": "rgba(195,52,52,0.2)",
            "handleColor": "#eb3020",
            "handleSize": "85%",
            "textStyle": {
                "color": "#e83828"
            }
        },
        "markPoint": {
            "label": {
                "normal": {
                    "textStyle": {
                        "color": "#eee"
                    }
                },
                "emphasis": {
                    "textStyle": {
                        "color": "#eee"
                    }
                }
            }
        }
    });
}));
