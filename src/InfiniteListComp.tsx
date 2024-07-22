import { useState, useEffect } from 'react';
import {
  UICompBuilder,
  NameConfig,
  stringSimpleControl,
  NumberControl,
  ArrayControl,
  Section,
  withDefault,
  withExposingConfigs,
  eventHandlerControl,
  styleControl,
  jsonObjectExposingStateControl,
  arrayStringExposingStateControl,
  arrayObjectExposingStateControl,
  booleanExposingStateControl,
  ContainerCompBuilder,
  BoolCodeControl,
  Container,
  withMethodExposing,
  AutoHeightControl,
  DisabledContext,
  HintPlaceHolder,
  InnerGrid,
  changeValueAction,
} from "lowcoder-sdk";
import { i18nObjs, trans } from "./i18n/comps";
import { version } from '../package.json';
import { useResizeDetector } from "react-resize-detector";
import { Avatar, Divider, List, Skeleton } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import InfiniteListContainer from './InfiniteListContainer';

// @ts-ignore

/**
 * Array of style configuration objects for styling the component.
 * Each object has a name, label, and style property key.
 */
export const PluginStyles = [
  {
    name: "padding",
    label: trans("style.padding"),
    padding: "padding",
  },
  {
    name: "margin",
    label: trans("style.margin"),
    padding: "margin",
  },
  {
    name: "textSize",
    label: trans("style.textSize"),
    textSize: "textSize",
  },
  {
    name: "backgroundColor",
    label: trans("style.backgroundColor"),
    backgroundColor: "backgroundColor",
  },
  {
    name: "border",
    label: trans("style.border"),
    border: "border",
  },
  {
    name: "radius",
    label: trans("style.borderRadius"),
    radius: "radius",
  },
  {
    name: "borderWidth",
    label: trans("style.borderWidth"),
    borderWidth: "borderWidth",
  }
] as const;


/**
 * Component configuration. 
 * Defines the styling options exposed in the component properties panel.
 */
var InfiniteListComp = (function () {

  //The events supported
  const eventDefinitions = [
    {
      label: "fetch",
      value: "fetch",
      description: "Triggers when data needs to loaded",
    },
  ];

  //All properties available in component
  const childrenMap = {
    autoHeight: withDefault(AutoHeightControl, true),
    styles: styleControl(PluginStyles),
    onEvent: eventHandlerControl(eventDefinitions),
    //Here real plugin starts
    data: arrayStringExposingStateControl("data"),
    loading: booleanExposingStateControl("loading", false),
    endMessage: stringSimpleControl("end-of-list"),
    limit: withDefault(NumberControl, 50),
    url: stringSimpleControl("https://randomuser.me/api/?results=10&inc=name,gender,email,nat,picture&noinfo"),
  };

  //The Builder function creating the real component
  return new UICompBuilder(childrenMap, (props: {
    autoHeight: boolean;
    styles: {
      backgroundColor: any; border: any; radius: any; borderWidth: any;
      margin: any; padding: any; textSize: any;
    };
    data: any;
    loading: any;
    onEvent: any;
    endMessage: string;
    limit: number;
    url: string;
  }) => {
    //Default size of component
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    //Catch the resizing of component

    // const { items: bodyItems, ...otherBodyProps } =
    // props.container.children.view.getView();
    // const { style, headerStyle, bodyStyle, footerStyle } = props.container;

    const { width, height, ref: conRef } = useResizeDetector({
      onResize: () => {
        const container = conRef.current;
        if (!container || !width || !height) return;

        if (props.autoHeight) {
          setDimensions({
            width,
            height: dimensions.height,
          })

          return;
        }

        setDimensions({
          width,
          height: height,
        })
      }
    });

    const [id] = useState(Math.random().toString(16).slice(2));

    const loadMoreData = () => {
      if (props.loading.value) {
        return;
      }
      if (props.url) {
        props.loading.onChange(true);
        //Just for testing
        fetch(props.url)
          .then((res) => res.json())
          .then((body) => {
            props.data.onChange([...(props.data.value || []), ...body.results])
            props.loading.onChange(false);
          }).catch(() => {
            props.loading.onChange(false);
          })
      } else {
        props.onEvent("fetch", props.data)
      }
    };

    useEffect(() => {
      loadMoreData();
    }, []);

    //Create the plugin container for the component
    //                <InfiniteListContainer {...item} />
    return (
      <div
        ref={conRef}
        id={'scrollableDiv' + id}
        style={{
          height: props.autoHeight ? '100%' : dimensions.height || '100%',
          width: dimensions.width,
          overflow: 'auto',
          border: `${props.styles.border}`,
          backgroundColor: `${props.styles.backgroundColor}`,
          borderColor: `${props.styles.border}`,
          borderRadius: `${props.styles.radius}`,
          borderWidth: `${props.styles.borderWidth}`,
          margin: `${props.styles.margin}`,
          padding: `${props.styles.padding}`,
          fontSize: `${props.styles.textSize}`,
        }}
      >
        <InfiniteScroll
          dataLength={(props.data.value.length || 0)}
          next={loadMoreData}
          hasMore={props.limit <= 0 ? true : (props.data.value.length || 0) < props.limit}
          loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
          endMessage={<Divider plain>{props.endMessage}</Divider>}
          scrollableTarget={'scrollableDiv' + id}
        >
          <List
            dataSource={props.data.value || []}
            renderItem={(item: any) => (
              <List.Item key={item.id}>

                <List.Item.Meta
                  avatar={<Avatar src={item.picture.large} />}
                  title={<a href="https://ant.design">{item.name.last}</a>}
                  description={item.id}
                />
                <div>Content</div>

                <InfiniteListContainer {...item} />
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>
    );
  })
    //The properties that will be visible inside lowcoder
    .setPropertyViewFn((children: any) => {
      return (
        <>
          <Section name="Base">
            {children.url.propertyView({ label: "API" })}
            {children.data.propertyView({ label: "Data" })}
            {children.limit.propertyView({ label: "Limit" })}
            {children.endMessage.propertyView({ label: "Message" })}
          </Section>

          <Section name="Interaction">
            {children.onEvent.propertyView()}
          </Section>

          <Section name="Styles">
            {children.autoHeight.getPropertyView()}
            {children.styles.getPropertyView()}
          </Section>

          <div >
            <div style={{ "fontSize": "x-small", "float": "right", "marginRight": "15px" }}>Version :  {version}</div>
          </div>
        </>
      );
    })
    .build();
})();


//Add autoheight to component
InfiniteListComp = class extends InfiniteListComp {
  autoHeight(): boolean {
    return this.children.autoHeight.getView();
  }
};

/**
 * Exposes methods on  component to allow calling from parent component.
 */
/*
InfiniteListComp = withMethodExposing(InfiniteListComp, [
 
  {
    method: {
      name: "xxx",
      params: [ {
          name: "message",
          type: "string",
        }],
      description: "Return the last map object",
    },
    execute: async (comp: any, params: any) => {
      return comp.exposingValues.events['map:init'] || {}
    }
  },

]);
*/

//Expose all methods
export default withExposingConfigs(InfiniteListComp, [
  new NameConfig("data", "data"),
  new NameConfig("loading", "loading"),
]);
