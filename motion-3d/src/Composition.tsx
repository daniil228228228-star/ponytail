import { CalculateMetadataFunction, Composition, useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";

type Props = {};

const calculateMetadata: CalculateMetadataFunction<Props> = () => {
  return {};
};

export const MyComposition = () => {
  return (
    <Composition
      id="Cube3D"
      component={Cube3DDemo}
      durationInFrames={60}
      fps={30}
      width={1280}
      height={720}
      calculateMetadata={calculateMetadata}
    />
  );
};

const Cube: React.FC = () => {
  const frame = useCurrentFrame();
  const rotation = (frame / 60) * Math.PI * 2;
  return (
    <mesh rotation={[rotation * 0.6, rotation, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="#4f7cff" />
    </mesh>
  );
};

export const Cube3DDemo: React.FC<Props> = () => {
  return (
    <ThreeCanvas linear width={1280} height={720}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} />
      <Cube />
    </ThreeCanvas>
  );
};
