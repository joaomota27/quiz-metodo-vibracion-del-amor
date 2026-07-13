import { Heart, Check, Lock, Star, Smartphone } from 'lucide-react';
import { CHECKOUT_URL } from '../constants';
import { trackEvent, appendTrackingToUrl } from '../tracking';
import CTAButton from '../components/CTAButton';
import TestimonialCard from '../components/TestimonialCard';
import FAQItem from '../components/FAQItem';
import CalendarGrid from '../components/CalendarGrid';
import AudioPlayer, { type AudioTrack } from '../components/AudioPlayer';
import React from 'react';

function goToCheckout() {
  window.location.href = appendTrackingToUrl(CHECKOUT_URL);
}

function Divider() {
  return <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,#fce8f3,transparent)', margin: '0 -20px' }} />;
}

function CheckItem({ text, light = false }: { text: string; light?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 10 }}>
      <div style={{
        width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 1,
        background: 'linear-gradient(135deg,#e8539c,#f27db8)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Check size={11} strokeWidth={3} style={{ color: 'white' }} />
      </div>
      <span style={{ fontSize: 13, lineHeight: 1.5, color: light ? 'rgba(255,255,255,0.78)' : '#4b5563' }}>{text}</span>
    </div>
  );
}

const TESTIMONIALS = [
  { text: 'Me ayudó a crear un momento para mí todos los días. Después de la primera semana ya me sentía más tranquila y conectada conmigo.', author: 'Mariana', age: 42 },
  { text: 'Lo que más me gustó fue la sensación de estar siguiendo una experiencia pensada para mí. Me sentí acompañada.', author: 'Valeria', age: 36 },
  { text: 'Empecé buscando sentirme mejor emocionalmente y terminé recuperando una parte de mí que había dejado de cuidar.', author: 'Lucía', age: 51 },
];

const FAQ_ITEMS = [
  { question: '¿Esto es una terapia?', answer: 'No. El Método Vibración del Amor™ no sustituye terapia, atención médica o acompañamiento profesional. Es una experiencia guiada de bienestar emocional.' },
  { question: '¿Cuánto tiempo necesito por día?', answer: 'Solo algunos minutos por la mañana y algunos minutos antes de dormir.' },
  { question: '¿Por cuánto tiempo dura?', answer: 'La experiencia principal está organizada en una jornada de 30 días.' },
  { question: '¿Recibo acceso inmediato?', answer: 'Sí. Después de la compra, recibirás las instrucciones de acceso.' },
  { question: '¿Necesito experiencia previa?', answer: 'No. La experiencia fue creada para ser simple, intuitiva y fácil de seguir.' },
  { question: '¿Esto garantiza que voy a encontrar el amor?', answer: 'No prometemos resultados específicos ni garantizados. La propuesta es ayudarte a fortalecer tu bienestar emocional, amor propio, confianza y apertura emocional.' },
];

const WEEKS = [
  { num: '1', week: 'Semana 1', title: 'Liberación Emocional', desc: 'Libera cargas emocionales acumuladas y comienza una nueva fase interior.', from: '#f27db8', to: '#e8539c' },
  { num: '2', week: 'Semana 2', title: 'Amor Propio', desc: 'Fortalece tu autoestima, tu autovaloración y la forma en que te miras a ti misma.', from: '#e8539c', to: '#c47b8a' },
  { num: '3', week: 'Semana 3', title: 'Vibración Afectiva', desc: 'Cultiva emociones más alineadas con el amor, la conexión y la receptividad.', from: '#a78bd4', to: '#e8539c' },
  { num: '4', week: 'Semana 4', title: 'Apertura al Amor', desc: 'Abre espacio emocional para nuevas posibilidades afectivas desde un lugar más seguro y consciente.', from: '#f4c460', to: '#f27db8' },
];

const S: Record<string, React.CSSProperties> = {
  section: { padding: '28px 20px' },
  sectionDark: { padding: '28px 20px', background: 'linear-gradient(135deg,#1a0c1f,#2d1533)' },
  sectionLight: { padding: '28px 20px', background: 'linear-gradient(135deg,#fff0f5,#fce8f3)' },
  h2: { fontFamily: "'Playfair Display',Georgia,serif", fontSize: 22, color: '#1f2937', lineHeight: 1.35, marginBottom: 16 },
  h2Light: { fontFamily: "'Playfair Display',Georgia,serif", fontSize: 22, color: 'white', lineHeight: 1.35, marginBottom: 16 },
};

const SAMPLE_TRACK: AudioTrack = {
  id: 'sample-morning',
  title: 'Amor Propio — Mañana',
  subtitle: 'Frecuencia Matutina · Día 7',
  src: 'https://www.soundjay.com/buttons/sounds/button-09.mp3',
  coverColor: 'linear-gradient(135deg,#e8539c,#f27db8)',
};

export default function SalesPage() {
  React.useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflowX = html.style.overflowX;
    const previousHtmlOverflowY = html.style.overflowY;
    const previousHtmlHeight = html.style.height;
    const previousHtmlWidth = html.style.width;
    const previousBodyOverflowX = body.style.overflowX;
    const previousBodyOverflowY = body.style.overflowY;
    const previousBodyHeight = body.style.height;
    const previousBodyPosition = body.style.position;
    const previousBodyTouchAction = body.style.touchAction;
    const previousBodyWidth = body.style.width;

    html.style.overflowX = 'hidden';
    html.style.overflowY = 'auto';
    html.style.height = 'auto';
    html.style.width = '100%';
    body.style.overflowX = 'hidden';
    body.style.overflowY = 'auto';
    body.style.height = 'auto';
    body.style.position = 'static';
    body.style.touchAction = 'pan-y';
    body.style.width = '100%';

    return () => {
      html.style.overflowX = previousHtmlOverflowX;
      html.style.overflowY = previousHtmlOverflowY;
      html.style.height = previousHtmlHeight;
      html.style.width = previousHtmlWidth;
      body.style.overflowX = previousBodyOverflowX;
      body.style.overflowY = previousBodyOverflowY;
      body.style.height = previousBodyHeight;
      body.style.position = previousBodyPosition;
      body.style.touchAction = previousBodyTouchAction;
      body.style.width = previousBodyWidth;
    };
  }, []);

  return (
    <div
      className="sales-page scrollbar-hide"
      style={{
        minHeight: '100dvh',
        overflowX: 'hidden',
        background: 'white',
      }}
    >
      <style>
        {`
          .sales-page,
          .sales-page * {
            max-width: 100%;
            box-sizing: border-box;
          }

          .sales-page {
            overflow-y: visible !important;
            touch-action: pan-y;
            -webkit-overflow-scrolling: touch;
          }
        `}
      </style>

      {/* HERO */}
      <div style={{ ...S.sectionDark, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 16, left: 16, width: 80, height: 80, borderRadius: '50%', background: 'radial-gradient(circle,rgba(232,83,156,0.2),transparent)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#e8539c,#f27db8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Heart size={26} fill="white" style={{ color: 'white' }} />
          </div>
        </div>
        <p style={{ fontSize: 11, color: '#f27db8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Método Vibración del Amor™</p>
        <h1 style={{ ...S.h2Light, fontSize: 24 }}>
          Comienza tu experiencia de 30 días para fortalecer tu amor propio, tu confianza y tu apertura emocional.
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.58)', fontSize: 13, lineHeight: 1.65, marginBottom: 24 }}>
          El Método Vibración del Amor™ es una experiencia guiada con frecuencias sonoras matutinas y nocturnas, creada para ayudarte a construir una rutina diaria de bienestar emocional en apenas unos minutos al día.
        </p>
        <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 20, padding: 20, marginBottom: 20, border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'inline-block', background: 'rgba(232,83,156,0.25)', border: '1px solid rgba(232,83,156,0.4)', borderRadius: 8, padding: '3px 10px', marginBottom: 10 }}>
            <span style={{ color: '#f9a8d4', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Oferta por tiempo limitado</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 22, color: 'rgba(255,255,255,0.35)', fontWeight: 400, textDecoration: 'line-through' }}>US$97</span>
            <span style={{ background: '#e8539c', color: 'white', fontSize: 11, fontWeight: 700, borderRadius: 6, padding: '2px 7px' }}>84% OFF</span>
          </div>
          <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 52, color: 'white', fontWeight: 700, lineHeight: 1 }}>US$15,90</p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 4 }}>Pago único · Sin mensualidades</p>
        </div>
        <CTAButton onClick={goToCheckout} pulse showArrow>Comenzar ahora por US$15,90</CTAButton>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 14, flexWrap: 'wrap' }}>
          {['Acceso inmediato', 'Sin mensualidades', '100% digital'].map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Check size={11} style={{ color: '#f27db8' }} />
              <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11 }}>{t}</span>
            </div>
          ))}
        </div>
      </div>

      <Divider />

      {/* QUE ES */}
      <div style={{ ...S.section, background: 'white' }}>
        <h2 style={S.h2}>¿Qué es el Método Vibración del Amor™?</h2>
        <div style={{ marginBottom: 12 }}>
          {['No es un curso.', 'No es una mentoría.', 'No es terapia.'].map((t, i) => (
            <p key={i} style={{ color: '#e8539c', fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{t}</p>
          ))}
        </div>
        <p style={{ color: '#6b7280', fontSize: 13, lineHeight: 1.65 }}>
          Es una experiencia emocional guiada de 30 días, diseñada para ayudarte a crear un nuevo punto de partida desde el amor propio, la calma, la confianza y la receptividad emocional.
        </p>
      </div>

      <Divider />

      {/* LO QUE RECIBES */}
      <div style={S.sectionLight}>
        <h2 style={S.h2}>Dentro de la experiencia recibirás:</h2>
        {['30 frecuencias matutinas','30 frecuencias nocturnas','Calendario de seguimiento','Guía de utilización','Experiencia organizada por etapas','Acceso desde cualquier dispositivo','Rutina diaria de pocos minutos','Contenidos adicionales de acompañamiento'].map((t, i) => (
          <CheckItem key={i} text={t} />
        ))}
      </div>

      <Divider />

      {/* JORNADA */}
      <div style={{ ...S.section, background: 'white' }}>
        <h2 style={S.h2}>Una jornada emocional en 4 etapas</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {WEEKS.map((w, i) => (
            <div key={i} className="glass-card" style={{ borderRadius: 20, padding: 16, display: 'flex', gap: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, color: 'white', background: `linear-gradient(135deg,${w.from},${w.to})` }}>{w.num}</div>
              <div>
                <p style={{ fontSize: 11, color: '#f27db8', fontWeight: 500, marginBottom: 2 }}>{w.week}</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#1f2937', marginBottom: 4 }}>{w.title}</p>
                <p style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.55 }}>{w.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Divider />

      {/* APP MOCKUP */}
      <div style={{ ...S.sectionDark, textAlign: 'center' }}>
        <h2 style={S.h2Light}>Solo abre, presiona play y vive tu momento.</h2>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 1.65, marginBottom: 24 }}>
          Cada día tendrás una frecuencia para la mañana y otra para antes de dormir. La experiencia fue diseñada para ser simple, elegante y fácil de seguir.
        </p>
        <div style={{ maxWidth: 320, margin: '0 auto', background: 'rgba(255,255,255,0.07)', borderRadius: 24, padding: 16, border: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg,#e8539c,#f27db8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Heart size={13} fill="white" style={{ color: 'white' }} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ color: 'white', fontSize: 12, fontWeight: 600 }}>Vibración del Amor™</p>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10 }}>Día 7 de 30</p>
            </div>
            <Smartphone size={13} style={{ color: 'rgba(255,255,255,0.25)' }} />
          </div>
          <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: 12, marginBottom: 12 }}>
            <AudioPlayer track={SAMPLE_TRACK} dark />
          </div>
          <CalendarGrid totalDays={30} completedDays={[1,2,3,4,5,6,7]} currentDay={8} />
          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 9, textAlign: 'right', marginTop: 8 }}>7 días seguidos ✨</p>
        </div>
      </div>

      <Divider />

      {/* PARA QUIEN ES */}
      <div style={S.sectionLight}>
        <h2 style={S.h2}>Esta experiencia puede ser para ti si...</h2>
        {['Deseas fortalecer tu amor propio','Quieres sentirte más segura emocionalmente','Estás en una nueva etapa de vida','Deseas reconectar contigo misma','Quieres abrirte al amor sin perder tu paz interior','Buscas una rutina simple de bienestar emocional'].map((t, i) => (
          <CheckItem key={i} text={t} />
        ))}
      </div>

      <Divider />

      {/* TESTIMONIALS */}
      <div style={{ ...S.section, background: 'white' }}>
        <h2 style={S.h2}>Mujeres que comenzaron esta jornada comparten:</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {TESTIMONIALS.map((t, i) => <TestimonialCard key={i} {...t} />)}
        </div>
      </div>

      <Divider />

      {/* OFERTA */}
      <div style={{ ...S.sectionDark, textAlign: 'center' }}>
        <h2 style={S.h2Light}>Accede hoy al Método Vibración del Amor™</h2>
        <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, lineHeight: 1.65, marginBottom: 20 }}>
          Recibe acceso inmediato a la experiencia completa de 30 días y comienza hoy mismo tu nueva rutina emocional.
        </p>
        <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 24, padding: 24, marginBottom: 20, border: '1px solid rgba(255,255,255,0.08)', textAlign: 'left' }}>
          <div style={{ marginBottom: 6 }}>
            <div style={{ display: 'inline-block', background: 'rgba(232,83,156,0.22)', border: '1px solid rgba(232,83,156,0.38)', borderRadius: 8, padding: '3px 10px', marginBottom: 8 }}>
              <span style={{ color: '#f9a8d4', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Oferta especial</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
              <span style={{ fontSize: 20, color: 'rgba(255,255,255,0.32)', fontWeight: 400, textDecoration: 'line-through' }}>US$97</span>
              <span style={{ background: 'linear-gradient(135deg,#e8539c,#f27db8)', color: 'white', fontSize: 11, fontWeight: 700, borderRadius: 6, padding: '2px 8px' }}>84% OFF</span>
            </div>
          </div>
          <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: 56, color: 'white', fontWeight: 700, marginBottom: 4, lineHeight: 1 }}>US$15,90</p>
          <p style={{ color: 'rgba(255,255,255,0.38)', fontSize: 12, marginBottom: 20 }}>Inversión única · Sin mensualidades</p>
          {['Pago único','Acceso inmediato','60 experiencias sonoras','Programa completo de 30 días','Sin mensualidades'].map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Check size={14} style={{ color: '#f27db8', flexShrink: 0 }} />
              <span style={{ color: 'rgba(255,255,255,0.68)', fontSize: 13 }}>{t}</span>
            </div>
          ))}
        </div>
        <CTAButton onClick={goToCheckout} pulse>Sí, quiero comenzar ahora</CTAButton>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 12 }}>
          <Lock size={12} style={{ color: 'rgba(255,255,255,0.28)' }} />
          <span style={{ color: 'rgba(255,255,255,0.28)', fontSize: 11 }}>Pago 100% seguro</span>
        </div>
      </div>

      <Divider />

      {/* GARANTIA */}
      <div style={{ ...S.sectionLight, textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'linear-gradient(135deg,#fce8f3,#fbd1e9)', border: '2px solid #fce8f3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Star size={24} fill="#e8539c" style={{ color: '#e8539c' }} />
          </div>
        </div>
        <h2 style={{ ...S.h2, textAlign: 'center' }}>Garantía de tranquilidad</h2>
        <p style={{ color: '#6b7280', fontSize: 13, lineHeight: 1.65 }}>
          Queremos que vivas esta experiencia con calma y confianza. Si después de acceder sientes que no es para ti, podrás solicitar soporte dentro del plazo informado en la página de compra.
        </p>
      </div>

      <Divider />

      {/* FAQ */}
      <div style={{ ...S.section, background: 'white' }}>
        <h2 style={S.h2}>Preguntas frecuentes</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {FAQ_ITEMS.map((item, i) => <FAQItem key={i} question={item.question} answer={item.answer} />)}
        </div>
      </div>

      <Divider />

      {/* Final CTA */}
      <div style={{ ...S.sectionLight, textAlign: 'center' }}>
        <CTAButton onClick={goToCheckout} pulse>Sí, quiero comenzar ahora</CTAButton>
        <p style={{ color: '#9ca3af', fontSize: 11, marginTop: 10 }}>
          <span style={{ textDecoration: 'line-through', color: '#d1d5db', marginRight: 6 }}>US$97</span>
          Hoy solo US$15,90 · Acceso inmediato
        </p>
      </div>

      {/* Footer */}
      <div style={{ background: '#1f2937', padding: '24px 20px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          <Heart size={14} fill="#e8539c" style={{ color: '#e8539c' }} />
          <span style={{ color: 'rgba(255,255,255,0.68)', fontSize: 13, fontWeight: 500 }}>Método Vibración del Amor™</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, marginBottom: 8 }}>Experiencia guiada de bienestar emocional femenino.</p>
        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10, lineHeight: 1.6 }}>
          Este producto no sustituye terapia, tratamiento médico o psicológico. Los resultados pueden variar de persona a persona.
        </p>
      </div>
    </div>
  );
}
