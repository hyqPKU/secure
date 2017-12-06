语义图形验证码
=============

### 思路

选择带有语义的图片作为图形验证码的图片，让用户根据提示语选择语义匹配的图片。
例：
请选出下图中花瓣为白色、花蕊为黄色的花

![captcha](/captcha.PNG)


### 参考文章

[Generative Adversarial Text to Image Synthesis](https://arxiv.org/abs/1605.05396)

![result](/paper_result.PNG)

### 模型 GAN-INT, GANINT-CLS

![model](/paper_model.PNG)

通过输入一段对花颜色、形状的描述，生成符合描述的图片

### 实现：

[text-to-image](https://github.com/paarthneekhara/text-to-image)

### 可行性分析：

选择该类型验证码的主要问题是难以寻找大量合适的图片，但通过GAN生成模型可以通过输入自然语言生成可靠的图片，作为图形验证码的素材。
