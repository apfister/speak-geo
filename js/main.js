var map, mapScene, mapView, sceneView, searchWidgetNav, searchWidgetPanel, activeView;
define(
  [
    "esri/Map",
    "esri/Basemap",
    "esri/views/MapView",
    "esri/views/SceneView",
    "esri/widgets/Search",
    "esri/widgets/PopupTemplate",
    "esri/core/watchUtils",
    "dojo/query",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom-construct",

    "bootstrap/Collapse", 
    "bootstrap/Dropdown",
    "bootstrap/Tab",
    "bootstrap/Tooltip",
    "calcite-maps/calcitemapsdojo",
    "dojo/domReady!"
  ],
  function (
    Map, 
    Basemap, 
    MapView, 
    SceneView, 
    Search, 
    PopupTemplate,
    watchUtils, 
    query,
    declare,
    lang,
    domConstruct
  ) 
  {
    return declare(null, {
      startup: function () {
        // Map 
        map = new Map({
          basemap: "vector-streets-mobile"
        });
        mapView = new MapView({
          container: "mapViewDiv",
          map: map,
          center: [-118, 34],
          zoom: 7
        });
        mapView.popup.anchor = "top";

        // Scene
        // mapScene = new Map({
        //   basemap: "streets"`
        // });
        // sceneView = new SceneView({
        //   container: "sceneViewDiv",
        //   map: mapScene,
        //   center: [-118, 34],
        //   zoom: 4
        // });
        // sceneView.popup.anchor = "top";

        activeView = mapView;

        // Search
        searchDivNav = this.createSearchWidget("searchNavDiv");
        // searchWidgetPanel = this.createSearchWidget("searchDivPanel");

        // query("li a[data-toggle='tab']").on("click", function(e) {
        //   if (e.target.text === "Map") {
        //     activeView = mapView;                    
        //   } else {
        //     activeView = sceneView;
        //   }
        // });

        query("#selectBasemapPanel").on("change", function(e){
          map.basemap = e.target.options[e.target.selectedIndex].dataset.vector;
          // mapScene.basemap = e.target.options[e.target.selectedIndex].value;
        });

        var holder = query('.actionsPane')[0];
        var newAction = domConstruct.toDom('<div class="actionList"><a title="Speak" to="" class="action actionSpeak" href="javascript:void(0);"><span>Speak</span></a></div>');
        domConstruct.place(newAction, holder, 'last');

        query('.actionSpeak').on('click', lang.hitch(this, this.speakAddress));
      },

      speakAddress: function () {
        responsiveVoice.speak(this.speakAddress || 'no address found!');
      },

      createSearchWidget: function (parentId) {
        var template = new PopupTemplate({
          title: "<p>{Match_addr}</p>", //description is the text in the popup. {fieldName} can be used to reference the value of the selected feature
          description: "<p><b> Marriage Rate: {MARRIEDRATE}% </b></p>" +
            "<p> Married: {MARRIED_CY}</p>" +
            "<p> Never Married: {NEVMARR_CY}</p>" +
            "<p> Divorced: {DIVORCD_CY}</p>"
        });

        var search = new Search({
          view: activeView,
          enableHighlight: false
          // ,popupTemplate: template
          }, parentId);
        search.startup();
        // Set active view
        search.watch(function(property, oldValue, newValue){
          if (property === "searchResults") {
              search.view = activeView;
              // mapView.popup.setTitle('hello world');
          }
        });
        var me = this;
        search.on('search-results', function (response) {
          if (response.results[0].length > 0) {
            var address = response.results[0][0].feature.attributes['Match_addr'];
            me.speakAddress = address;
          }
        });
        return search;
      }
    });
  }
);