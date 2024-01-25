const fs = require("fs");
const path = require("path");

async function generarImagenElemento(nombre, protones, neutrones, electrones) {
  const { createCanvas } = require("canvas");

  // Configurar el lienzo
  const canvas = createCanvas(800, 800);
  const ctx = canvas.getContext("2d");

  // Distribuir protones y neutrones aleatoriamente en una zona central más pequeña
  distribuirParticulas(ctx, 400, 400, protones, neutrones);

  // Dibujar órbitas y colocar electrones
  const orbitas = [120, 160, 200, 240, 280, 320, 360];
  let totalElectronesDistribuidos = 0;

  for (let i = 0; i <= orbitas.length; i++) {
    const electronesEnOrbita = Math.min(
      await calcularMaxElectronesEnCapa(i + 1, protones),
      electrones - totalElectronesDistribuidos
    );
    dibujarOrbita(ctx, 400, 400, orbitas[i]);
    await colocarElectronesEnOrbita(
      ctx,
      400,
      400,
      i + 1,
      orbitas[i],
      electronesEnOrbita,
      protones
    );
    totalElectronesDistribuidos += electronesEnOrbita;

    if (totalElectronesDistribuidos >= electrones) {
      break;
    }
  }

  // Crear la carpeta "img" si no existe
  const carpetaImg = path.join(__dirname, "..", "img");
  if (!fs.existsSync(carpetaImg)) {
    fs.mkdirSync(carpetaImg);
  }

  // Guardar la imagen en un archivo dentro de la carpeta "img"
  const nombreArchivo = path.join(carpetaImg, `${nombre.toLowerCase()}.png`);
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(nombreArchivo, buffer);
  console.log(`Imagen para ${nombre} creada: ${nombreArchivo}`);
}

function dibujarOrbita(ctx, x, y, radio) {
  ctx.beginPath();
  ctx.arc(x, y, radio, 0, 2 * Math.PI);
  ctx.strokeStyle = "black";
  ctx.stroke();
}

async function colocarElectronesEnOrbita(
  ctx,
  x,
  y,
  capa,
  radio,
  totalElectrones,
  protones
) {
  const maxElectrones = await calcularMaxElectronesEnCapa(capa, protones);
  const anguloEntreElectrones = (2 * Math.PI) / maxElectrones;

  // ctx.fillStyle = "#50C878";
  ctx.fillStyle = "#3498db";

  for (let i = 0; i < totalElectrones; i++) {
    if (i < maxElectrones) {
      const angle = i * anguloEntreElectrones;
      const electronX = x + radio * Math.cos(angle);
      const electronY = y + radio * Math.sin(angle);
      ctx.beginPath();
      ctx.arc(electronX, electronY, 5, 0, 2 * Math.PI);
      ctx.fill();
    }
  }
}

function distribuirParticulas(ctx, x, y, protones, neutrones) {
  const totalParticulas = protones + neutrones;
  const particulas = Array.from({ length: totalParticulas }, (_, index) =>
    index % 2 === 0 ? "proton" : "neutron"
  );

  particulas.forEach((particula) => {
    if (particula === "proton") {
      distribuirParticulaEnZona(
        ctx,
        x,
        y,
        "red",
        5,
        Math.ceil(Math.pow(protones + neutrones, 1 / 1.47))
      );
    } else {
      distribuirParticulaEnZona(
        ctx,
        x,
        y,
        "green",
        5,
        Math.ceil(Math.pow(protones + neutrones, 1 / 1.47))
      );
    }
  });
}

function distribuirParticulaEnZona(ctx, x, y, color, radiusMin, radiusMax) {
  ctx.fillStyle = color;

  const radius = Math.random() * (radiusMax - radiusMin) + radiusMin;
  const angle = Math.random() * 2 * Math.PI;
  const particleX = x + radius * Math.cos(angle);
  const particleY = y + radius * Math.sin(angle);

  ctx.beginPath();
  ctx.arc(particleX, particleY, 5, 0, 2 * Math.PI);
  ctx.fill();
}

async function calcularMaxElectronesEnCapa(capa, atomicNumber) {
  const data = await fs.promises.readFile("./data/shells.json", "utf-8");
  const atoms = JSON.parse(data);

  const shells = atoms[atomicNumber].shells.split(",");
  return parseInt(shells[capa - 1]);
}

// ----------------------------------------

const getAtomList = async () => {
  fs.readFile("./data/list.json", "utf-8", (req, res) => {
    const atoms = JSON.parse(res);

    for (const [name, properties] of Object.entries(atoms)) {
      generarImagenElemento(
        name,
        properties.protones,
        properties.neutrones,
        properties.electrones
      );
    }
  });
};

getAtomList();
