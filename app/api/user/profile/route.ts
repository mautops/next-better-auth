import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import type { Prisma } from "@/lib/generated/prisma/client";
import { updateProfileSchema } from "@/types/profile";

export async function PATCH(request: NextRequest) {
  try {
    // 验证用户身份
    const session = await auth.api.getSession({
      headers: request.headers as unknown as Headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "未授权访问" },
        { status: 401 }
      );
    }

    // 解析请求体
    const body = await request.json();
    
    // 验证数据格式
    const validationResult = updateProfileSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: "数据验证失败", 
          details: validationResult.error.issues 
        },
        { status: 400 }
      );
    }

    const { name, cn_name, alas, phone, extra } = validationResult.data;

    // 处理空字符串转为 null
    const processedPhone = phone && phone.trim() !== "" ? phone.trim() : null;
    const processedCnName = cn_name && cn_name.trim() !== "" ? cn_name.trim() : null;
    const processedAlas = alas && alas.trim() !== "" ? alas.trim() : null;

    // 检查手机号是否已被其他用户使用
    if (processedPhone) {
      const existingUser = await prisma.user.findFirst({
        where: {
          phone: processedPhone,
          id: { not: session.user.id }
        }
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "该手机号已被其他用户使用" },
          { status: 409 }
        );
      }
    }

    // 更新用户资料
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        cn_name: processedCnName,
        alas: processedAlas,
        phone: processedPhone,
        extra: (extra || {}) as Prisma.InputJsonValue,
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        cn_name: true,
        alas: true,
        phone: true,
        extra: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    return NextResponse.json({
      message: "个人资料更新成功",
      user: updatedUser
    });

  } catch (error) {
    console.error("更新个人资料失败:", error);
    
    // 处理 Prisma 唯一约束错误
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      if (error.message.includes("phone")) {
        return NextResponse.json(
          { error: "该手机号已被使用" },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // 验证用户身份
    const session = await auth.api.getSession({
      headers: request.headers as unknown as Headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "未授权访问" },
        { status: 401 }
      );
    }

    // 获取用户完整资料
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        cn_name: true,
        alas: true,
        phone: true,
        extra: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "用户不存在" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });

  } catch (error) {
    console.error("获取用户资料失败:", error);
    return NextResponse.json(
      { error: "服务器内部错误" },
      { status: 500 }
    );
  }
}