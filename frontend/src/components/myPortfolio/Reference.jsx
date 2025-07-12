import { Award } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

const Reference = ({ item }) => {
  return (
    <Card className="border w-full">
      <CardContent className="space-y-3">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div>
            <div className="flex">
              <div className="w-5 h-5 border-2 border-green-400 rounded-full flex items-center justify-center text-green-400 text-xs">
                <Award className="w-3 h-3" />
              </div>
              <p className="text-[12px] italic mx-2">{`"${item.description}"`}</p>
            </div>
            <div className="gap-5 mx-7 mt-2">
              <p className="nunito-text text-[#191A1C] text-xs">{item.name}</p>
              <p className="text-xs text-[#141414B2]">{item.specification}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default Reference;
