import * as Cesium from 'cesium';
import {
  Cartesian3,
  Math as CesiumMath,
  Viewer,
  Terrain,
  createOsmBuildingsAsync,
  Ion,
  JulianDate,
  SampledPositionProperty,
  TimeIntervalCollection,
  TimeInterval,
  PathGraphics,
  PolylineGlowMaterialProperty,
  Quaternion,
  Matrix3,
  Color,
  Rectangle,
} from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import "./style.css";

// LoadDataButton Component
export const LoadDataButton = () => {
  const renderButton = () => {
    const button = document.createElement("button");
    button.appendChild(document.createTextNode("Upload GeoJSON Data"));
    button.className = "loadData";
    button.style.cssText =
      "outline:none; width:300px; border-width:1px; color:Gainsboro; background:#1E90FF; height:36px; position: fixed;top: 10%;left: 20%;transform: translate(-50%, -50%);font-size:24px; border-radius:100px padding:14px; box-shadow:rgba(0, 0, 0, 0.24) 0px 3px 8px; ";
    button.addEventListener("click", FileSelector);
    return button;
  };

  const renderContainer = () => {
    const div = document.createElement("div");
    div.appendChild(renderButton());
    return div;
  };

  return renderContainer();
};

// File Selector
const FileSelector = () => {
  const fileUpload = document.createElement("input");
  fileUpload.type = "file";
  fileUpload.click();
  fileUpload.addEventListener("change", fileUploadReader);
};

// File Reader
const fileUploadReader = (event) => {
  const reader = new FileReader();
  reader.onload = () => geoJSONtoCesium(reader.result);
  reader.readAsText(event.target.files[0]);
};

const runCesiumApp = async (flightData) => {
  const apiKey = "AAPK46fca18c184143bbb5ac9ade6aa657ecEvGup0YLGB3ZDZ8pJEG2X05Ra24c5SboTPVPiosdNWgsU3yTyhAcEQQy7_Lm8Qli";
  Cesium.ArcGisMapService.defaultAccessToken = apiKey;
  const authentication = arcgisRest.ApiKeyManager.fromKey(apiKey);
  const cesiumAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1NGUyZGZlNy04YTA1LTQ4ZjUtOGY4MS1mZDBlYjkxMDM3NjkiLCJpZCI6MjAwMzM3LCJpYXQiOjE3MDk4MjU2NDh9.bBIcSAii0751kFBTtAqhvzZS6TQjVAkeZMFVLYvDQzI";
  // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJkNjljOTQ2Zi01ZDkyLTRiMjEtYTAzZi1hNGU1MDA2YjFiNDYiLCJpZCI6MjAwMzM3LCJpYXQiOjE3MDk4MjU3MjV9.Idb-55ppU8jZvmftgAYaGuVwJI0H5649EQQdANafiYM
  Cesium.Ion.defaultAccessToken = cesiumAccessToken;
  // Initialize the Cesium Viewer in the HTML element with the `cesiumContainer` ID.
  const viewer = new Cesium.Viewer('cesiumContainer', {
    terrain: Cesium.Terrain.fromWorldTerrain(),
    sceneModePicker: false,
    shouldAnimate: true,
    baseLayerPicker: false,
    scene3DOnly: true,
    requestRenderMode: true,
  });
  viewer.scene.globe.enableLighting = true;
  const scene = viewer.scene;
  const globe = scene.globe;
  const AAIRRectangle = Cesium.Rectangle.fromDegrees(-84, 43, -83, 43);

  globe.cartographicLimitRectangle = AAIRRectangle;
  globe.showSkirts = false;
  globe.backFaceCulling = false;
  globe.undergroundColor = undefined;
  scene.skyAtmosphere.show = false;
  try {
    const tileset = await Cesium.createGooglePhotorealistic3DTileset();
    viewer.scene.primitives.add(tileset);
  } catch (error) {
    console.log(`Error loading Photorealistic 3D Tiles tileset. ${error}`);
  }

  // Set a custom home button command
  viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function (commandInfo) {
    // Change this to your desired custom extent
    var customExtent = Cesium.Rectangle.fromDegrees(
      -83.2879, 42.2551, -82.9105, 42.4505
    );

    // Fly to the custom extent
    viewer.camera.flyTo({
      destination: customExtent,
      duration: 2.0, // Adjust the duration as needed
    });

    // Tell the home button not to execute its default action
    commandInfo.cancel = true;
  });
  // STEP 3 CODE (all points)
  // These are all the equally spaced points from this flight.

  // const flightData = JSON.parse(
  //   '[{"longitude":-83.075726482999983,"latitude":42.328092321000042,"height":167.87},{"longitude":-83.075726482999983,"latitude":42.328092321000042,"height":267.87},{"longitude":-83.077150186999972,"latitude":42.327310981000039,"height":267.87},{"longitude":-83.077952598999957,"latitude":42.327495178000049,"height":267.87},{"longitude":-83.078379373999951,"latitude":42.327590004000058,"height":267.87},{"longitude":-83.078851465999946,"latitude":42.327702263000049,"height":267.87},{"longitude":-83.079291920999935,"latitude":42.327806382000063,"height":267.87},{"longitude":-83.080005898999957,"latitude":42.327952273000051,"height":267.87},{"longitude":-83.080344526999966,"latitude":42.328014920000044,"height":267.87},{"longitude":-83.080703492999987,"latitude":42.328069257000038,"height":267.87},{"longitude":-83.081017556999939,"latitude":42.32810943800007,"height":267.87},{"longitude":-83.081596532999981,"latitude":42.328169626000033,"height":267.87},{"longitude":-83.081658813999979,"latitude":42.328236696000033,"height":267.87},{"longitude":-83.081726309999965,"latitude":42.328307733000031,"height":267.87},{"longitude":-83.081802398999969,"latitude":42.328341702000046,"height":267.87},{"longitude":-83.081873345999952,"latitude":42.328367696000043,"height":267.87},{"longitude":-83.08200579399994,"latitude":42.328353381000056,"height":267.87},{"longitude":-83.082106417999967,"latitude":42.328346582000052,"height":267.87},{"longitude":-83.082183884999949,"latitude":42.328302364000081,"height":267.87},{"longitude":-83.082194597999944,"latitude":42.328294647000064,"height":267.87},{"longitude":-83.082221894999975,"latitude":42.328244056000074,"height":267.87},{"longitude":-83.082188228999939,"latitude":42.328198719000056,"height":267.87},{"longitude":-83.082139258999973,"latitude":42.328133806000039,"height":267.87},{"longitude":-83.082036565999942,"latitude":42.328111334000027,"height":267.87},{"longitude":-83.081909825999958,"latitude":42.32809835900008,"height":267.87},{"longitude":-83.081801475999953,"latitude":42.328095347000044,"height":267.87},{"longitude":-83.081727035999961,"latitude":42.328114215000028,"height":267.87},{"longitude":-83.081666033999966,"latitude":42.328127287000029,"height":267.87},{"longitude":-83.08161583399999,"latitude":42.328124848000073,"height":267.87},{"longitude":-83.081090250999978,"latitude":42.328072192000036,"height":267.87},{"longitude":-83.080518045999952,"latitude":42.32798714200004,"height":267.87},{"longitude":-83.080032155999959,"latitude":42.327899500000058,"height":267.87},{"longitude":-83.079560499999957,"latitude":42.32780979100005,"height":267.87},{"longitude":-83.079017266999983,"latitude":42.327690729000039,"height":267.87},{"longitude":-83.078696263999973,"latitude":42.327620885000044,"height":267.87},{"longitude":-83.07831440199999,"latitude":42.327525870000045,"height":267.87},{"longitude":-83.077929409999967,"latitude":42.327436625000075,"height":267.87},{"longitude":-83.07730070599996,"latitude":42.32730315200007,"height":267.87},{"longitude":-83.077151651999941,"latitude":42.327260014000046,"height":267.87},{"longitude":-83.075728184999946,"latitude":42.328026334000072,"height":267.87},{"longitude":-83.075734021999949,"latitude":42.32807305800003,"height":267.87},{"longitude":-83.075734021999949,"latitude":42.32807305800003,"height":167.87}]'
  // );
  // Create a point for each.
  for (let i = 0; i < flightData.length; i++) {
    const dataPoint = flightData[i];
    viewer.entities.add({
      description: `Location: (${dataPoint.longitude}, ${dataPoint.latitude}, ${dataPoint.height})`,
      position: Cesium.Cartesian3.fromDegrees(dataPoint.longitude, dataPoint.latitude, dataPoint.height),
      point: {pixelSize: .05, color: Cesium.Color.BLUE}
    });
  }
  const timeStepInSeconds = 30;
  const totalSeconds = timeStepInSeconds * (flightData.length - 1);
  const start = Cesium.JulianDate.fromIso8601("2020-03-09T23:10:00Z");
  const stop = Cesium.JulianDate.addSeconds(start, totalSeconds, new Cesium.JulianDate());
  viewer.clock.startTime = start.clone();
  viewer.clock.stopTime = stop.clone();
  viewer.clock.currentTime = start.clone();
  viewer.timeline.zoomTo(start, stop);
  // Speed up the playback speed 5x.
  viewer.clock.multiplier = 1;
  // Start playing the scene.
  viewer.clock.shouldAnimate = true;

  // The SampledPositionedProperty stores the position and timestamp for each sample along the radar sample series.
  const positionProperty = new Cesium.SampledPositionProperty();

  for (let i = 0; i < flightData.length; i++) {
    const dataPoint = flightData[i];

    // Declare the time for this individual sample and store it in a new JulianDate instance.
    const time = Cesium.JulianDate.addSeconds(start, i * timeStepInSeconds, new Cesium.JulianDate());
    const position = Cesium.Cartesian3.fromDegrees(dataPoint.longitude, dataPoint.latitude, dataPoint.height);
    // Store the position along with its timestamp.
    // Here we add the positions all upfront, but these can be added at run-time as samples are received from a server.
    positionProperty.addSample(time, position);

    viewer.entities.add({
      description: `Location: (${dataPoint.longitude}, ${dataPoint.latitude}, ${dataPoint.height})`,
      position: position,
      point: {pixelSize: 20, color: Cesium.Color.BLUE}
    });
  }

  // STEP 6 CODE (drone entity)
  async function loadModel() {
    // Load the glTF model from Cesium ion.
    const droneUri = await Cesium.IonResource.fromAssetId(2492576);
    const droneEntity = viewer.entities.add({
      availability: new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({start: start, stop: stop})]),
      position: positionProperty,
      // Attach the 3D model instead of the green point.
      model: {uri: droneUri, minimumPixelSize: 50},
      // Automatically compute the orientation from the position.
      orientation: new Cesium.CallbackProperty((time, result) => {
        // Create a rotation quaternion for 90-degree roll.
        const quaternion = Cesium.Quaternion.fromAxisAngle(Cesium.Cartesian3.UNIT_X, Cesium.Math.toRadians(48), result);
        // Apply the rotation to the entity's orientation.
        return Cesium.Matrix3.fromQuaternion(quaternion, result);
      }, false),
      path: new Cesium.PathGraphics({
        width: 20, material: new Cesium.PolylineGlowMaterialProperty({
          glowPower: 0.01,
          color: Cesium.Color.BLUE,
        })
      }),
    });
    viewer.trackedEntity = droneEntity;
  }
  loadModel();
  const entityPath = viewer.entities.add({
    position: positionProperty,
    name: "path",
    path: {
      show: true,
      leadTime: 0,
      trailTime: 1,
      width: 20,
      resolution: 1,
      material: new Cesium.PolylineGlowMaterialProperty({
        glowPower: 0.3,
        taperPower: 0.3,
        color: Cesium.Color.PALEGOLDENROD,
      }),
    },
  });
}

// Convert GeoJSON to Cesium Data
const geoJSONtoCesium = (geoJSONstring) => {
  const geoJSON = JSON.parse(geoJSONstring);
  const cesiumData = geoJSON.features.map((d) => ({
    longitude: d.geometry.coordinates[0],
    latitude: d.geometry.coordinates[1],
    height: d.geometry.coordinates[2],
  }));

  console.log(cesiumData);
  runCesiumApp(cesiumData);
};

// Initialize Button
document.body.appendChild(LoadDataButton());
