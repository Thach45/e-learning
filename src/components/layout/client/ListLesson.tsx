import { TShowCourse } from "@/types"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { PlayCircle } from "lucide-react"

type props = {
    courseInfo: TShowCourse | null | undefined
}
type Tlesson = {
    _id: string;
    title: string;
};

export const ListLesson = ({courseInfo}: props) => {
    return (
        
                <Accordion type="single" collapsible className="w-full">
                    {courseInfo?.lectures.map((lecture) => (
                        <AccordionItem key={lecture._id} value={lecture._id}>
                            <AccordionTrigger>
                                <div className="flex justify-between items-center cursor-pointer">
                                    <h3 className="text-xl font-semibold">
                                        {lecture.title}
                                    </h3>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {lecture.lesson.map(({ _id, title }: Tlesson) => (
                                        <div key={_id} className="flex items-center gap-4">
                                            <PlayCircle className="w-6 h-6 text-black" />
                                            <span>{title}</span>
                                        </div>
                                    ))}
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            
    )
}