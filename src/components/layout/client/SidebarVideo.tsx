import React, { useEffect, useState } from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { getCourseBySlug } from '@/lib/actions/course.action';
import { TShowCourse } from '@/types';

interface SidebarVideoProps {
  courseSlug: string;
}

export default function SidebarVideo({ courseSlug }: SidebarVideoProps) {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [course, setCourse] = useState<TShowCourse |null| undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      const course = await getCourseBySlug(courseSlug);
      setCourse(course);
      console.log(course);
    };
    fetchData();
  }, [courseSlug]);

  return (
    <aside className="w-64 bg-white shadow-md overflow-y-auto">
      <div className="p-4">
        {course && (
          <>
            <h2 className="text-xl font-bold">{course.title}</h2>
            <Accordion type="single" collapsible className="w-full">
              {course.lectures.map((lecture) => (
                <AccordionItem value={lecture._id} key={lecture._id}>
                  <AccordionTrigger>{lecture.title}</AccordionTrigger>
                  <AccordionContent>
                    {lecture.lesson.map((less) => (
                      <Button
                        key={less._id}
                        variant={selectedLesson === less._id ? "secondary" : "ghost"}
                        className="w-full justify-start text-left"
                        onClick={() => setSelectedLesson(less._id)}
                      >
                        {less.title}
                      </Button>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </>
        )}
      </div>
    </aside>
  );
}