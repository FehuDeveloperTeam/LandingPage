import { Document, Page, Text, View, StyleSheet, Font, pdf } from '@react-pdf/renderer'

Font.register({
  family: 'Poppins',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrFJA.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7V1s.ttf', fontWeight: 600 },
    { src: 'https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLDD4V1s.ttf', fontWeight: 700 },
  ]
})

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    fontFamily: 'Poppins',
    fontSize: 8,
  },
  sidebar: {
    width: '32%',
    backgroundColor: '#1e5a8a',
    color: '#ffffff',
    padding: 15,
    paddingTop: 20,
  },
  sidebarSection: {
    marginBottom: 12,
  },
  sidebarTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: '#f5a623',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  contactItem: {
    marginBottom: 5,
    fontSize: 7,
  },
  skillItem: {
    marginBottom: 2,
    fontSize: 7,
  },
  main: {
    width: '68%',
    padding: 15,
    paddingTop: 20,
  },
  name: {
    fontSize: 18,
    fontWeight: 700,
    color: '#1e5a8a',
    textAlign: 'center',
  },
  nameSurname: {
    fontSize: 18,
    fontWeight: 700,
    color: '#f5a623',
    textAlign: 'center',
    marginBottom: 6,
  },
  summary: {
    fontSize: 7,
    color: '#4a4a4a',
    textAlign: 'center',
    marginBottom: 5,
    lineHeight: 1.3,
  },
  education: {
    fontSize: 7,
    color: '#4a4a4a',
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    color: '#f5a623',
    marginTop: 8,
    marginBottom: 5,
    textTransform: 'uppercase',
  },
  experienceItem: {
    marginBottom: 6,
  },
  expPeriod: {
    fontSize: 6,
    color: '#666666',
  },
  expTitle: {
    fontSize: 8,
    fontWeight: 600,
    color: '#1e5a8a',
  },
  expCompany: {
    fontSize: 7,
    color: '#4a4a4a',
    marginBottom: 1,
  },
  bulletText: {
    fontSize: 6,
    color: '#4a4a4a',
    lineHeight: 1.2,
    paddingLeft: 6,
  },
  reference: {
    marginTop: 5,
    fontSize: 6,
  },
  refName: {
    fontWeight: 600,
    color: '#ffffff',
    fontSize: 7,
  },
})

const CurriculumPDF = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.sidebar}>
        <View style={styles.sidebarSection}>
          <Text style={styles.sidebarTitle}>Contacto</Text>
          <Text style={styles.contactItem}>{data.contacto.telefono}</Text>
          <Text style={styles.contactItem}>{data.contacto.instagram}</Text>
          <Text style={styles.contactItem}>{data.contacto.email}</Text>
          <Text style={styles.contactItem}>{data.contacto.ubicacion}</Text>
        </View>

        <View style={styles.sidebarSection}>
          <Text style={styles.sidebarTitle}>Habilidades</Text>
          {data.habilidades.map((hab, i) => (
            <View key={i} style={{ marginBottom: 4 }}>
              {hab.items.map((item, j) => (
                <Text key={j} style={styles.skillItem}>- {item}</Text>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.sidebarSection}>
          <Text style={styles.sidebarTitle}>Pretensiones</Text>
          <Text style={styles.skillItem}>- De mercado</Text>
        </View>

        <View style={styles.sidebarSection}>
          <Text style={styles.sidebarTitle}>Referencias</Text>
          <View style={styles.reference}>
            <Text style={styles.refName}>Antonio Luna Bascuñán</Text>
            <Text>Bicimoto | Gerente de ventas</Text>
            <Text>+56 9 81 89 57 86</Text>
            <Text>aluna@ibicimoto.com</Text>
          </View>
        </View>
      </View>

      <View style={styles.main}>
        <Text style={styles.name}>ANDRÉS FRANCISCO SIMÓN</Text>
        <Text style={styles.nameSurname}>ZURITA SANHUEZA</Text>
        
        {data.educacion.map((edu, i) => (
          <Text key={i} style={styles.education}>
            - {edu.titulo} ({edu.institucion}, {edu.periodo}. {edu.estado})
          </Text>
        ))}

        <Text style={[styles.summary, { marginTop: 6 }]}>{data.resumen}</Text>

        <Text style={styles.sectionTitle}>Experiencia Profesional</Text>
        {data.experienciaLaboral.map((exp, i) => (
          <View key={i} style={styles.experienceItem}>
            <Text style={styles.expPeriod}>{exp.periodo}</Text>
            <Text style={styles.expTitle}>{exp.cargo}</Text>
            <Text style={styles.expCompany}>{exp.empresa}</Text>
            <Text style={styles.bulletText}>- {exp.descripcion}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>Experiencia en Tecnología</Text>
        {data.experienciaTI.map((exp, i) => (
          <View key={i} style={styles.experienceItem}>
            <Text style={styles.expPeriod}>{exp.periodo}</Text>
            <Text style={styles.expTitle}>{exp.cargo}</Text>
            <Text style={styles.expCompany}>{exp.empresa}</Text>
            <Text style={styles.bulletText}>- {exp.descripcion}</Text>
          </View>
        ))}
      </View>
    </Page>
  </Document>
)

export const generatePDF = async (data) => {
  const blob = await pdf(<CurriculumPDF data={data} />).toBlob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'Curriculum_Andres_Zurita.pdf'
  link.click()
  URL.revokeObjectURL(url)
}

export default CurriculumPDF