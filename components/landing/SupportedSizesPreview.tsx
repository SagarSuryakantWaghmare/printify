import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const mainSizes = [
  {
    label: "Passport (India)",
    size: "35 x 45 mm",
    note: "Most common for passport, visa, govt forms.",
  },
  {
    label: "Stamp Size",
    size: "25 x 35 mm",
    note: "Useful for school/college and local form requirements.",
  },
  {
    label: "Custom",
    size: "Your choice",
    note: "Set your own width and height if your form asks specific size.",
  },
]

const docUseCases = [
  "Aadhaar update forms",
  "PAN card application",
  "Driving licence paperwork",
  "Railway concession / pass",
  "School / college ID forms",
]

export function SupportedSizesPreview() {
  return (
    <section id="sizes" className="space-y-6">
      <div className="text-center space-y-3 mt-12">
        <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
          Supported Photo <span className="gradient-text">Sizes</span>
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-base text-slate-600 sm:text-lg">
          Designed around commonly used Indian document photo standards.
        </p>
      </div>

      <Tabs defaultValue="sizes" className="w-full">
        <TabsList className="grid h-auto w-full grid-cols-2 rounded-xl bg-slate-100 p-1">
          <TabsTrigger value="sizes" className="rounded-lg py-2 text-xs sm:text-sm">Main Sizes</TabsTrigger>
          <TabsTrigger value="documents" className="rounded-lg py-2 text-xs sm:text-sm">Document Use Cases</TabsTrigger>
        </TabsList>

        <TabsContent value="sizes" className="mt-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {mainSizes.map((item) => (
              <Card key={item.label} className="border-slate-200/60 bg-white/70 backdrop-blur-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 rounded-2xl">
                <CardHeader className="pb-3 pt-6 px-6">
                  <Badge className="w-fit bg-[#FFF1ED] text-[#C84426] hover:bg-[#FFF1ED] mb-2">{item.label}</Badge>
                  <CardTitle className="font-display text-2xl text-slate-900">{item.size}</CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <p className="text-base leading-relaxed text-slate-600">{item.note}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <Card className="border-slate-200/60 bg-white/70 backdrop-blur-md rounded-2xl">
            <CardHeader className="px-6 pt-6 pb-4">
              <CardTitle className="font-display text-xl text-slate-900 sm:text-2xl">
                Common India document scenarios
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 px-6 pb-6">
              {docUseCases.map((useCase) => (
                <p key={useCase} className="rounded-xl border border-slate-200/60 bg-white shadow-sm px-4 py-3 text-sm font-medium text-slate-700">
                  {useCase}
                </p>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </section>
  )
}
