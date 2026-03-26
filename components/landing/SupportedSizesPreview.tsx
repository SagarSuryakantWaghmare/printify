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
      <div className="text-center">
        <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
          Supported Photo Sizes
        </h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-slate-600 sm:text-base">
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
              <Card key={item.label} className="border-slate-200">
                <CardHeader className="pb-2">
                  <Badge className="w-fit bg-[#FFF1ED] text-[#C84426] hover:bg-[#FFF1ED]">{item.label}</Badge>
                  <CardTitle className="font-display text-xl text-slate-900">{item.size}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600">{item.note}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="documents" className="mt-4">
          <Card className="border-slate-200">
            <CardHeader>
              <CardTitle className="font-display text-lg text-slate-900 sm:text-xl">
                Common India document scenarios
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {docUseCases.map((useCase) => (
                <p key={useCase} className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
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
